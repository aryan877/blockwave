import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Input,
  Text,
  Textarea,
} from '@chakra-ui/react';
import axios from 'axios';
import { ethers } from 'ethers';
import {
  Field,
  Form,
  Formik,
  FormikHelpers,
  FormikValues,
  getIn,
} from 'formik';
import { isEmpty } from 'lodash';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDropzone } from 'react-dropzone';
import { BsCardImage } from 'react-icons/bs';
import { FiArrowLeft } from 'react-icons/fi';
import { IoImagesOutline } from 'react-icons/io5';
import { MdClose, MdImage } from 'react-icons/md';
import { start } from 'repl';

import { Grenze } from 'next/font/google';
import { Accept } from 'react-dropzone';
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import { TicketFactory } from '../../abi/address';
import TicketABI from '../../abi/TicketFactory.json';
import Logger from '../../components/Logger';
import { useNotification } from '../../context/NotificationContext';
import metadata from './api/event/metadata';

function CreateEvent() {
  const roundOffToNearest15Minutes = (date: Date): Date => {
    const minutes = date.getMinutes();
    const roundedMinutes = Math.floor(minutes / 15) * 15;
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      roundedMinutes
    );
  };
  const formRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { address } = useAccount();
  const { addNotification, removeNotification } = useNotification();
  const [metaDataLink, setMetaDataLink] = useState<string | undefined>(
    undefined
  );
  const [file, setFile] = useState<File | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [startDate, setStartDate] = useState<Date>(
    roundOffToNearest15Minutes(new Date())
  );
  const [endDate, setEndDate] = useState<Date>(
    roundOffToNearest15Minutes(new Date(Date.now() + 60 * 60 * 1000))
  );
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [formValues, setFormValues] = useState<FormikValues>({});
  function handleFormValuesChange(newValues: FormikValues) {
    setFormValues(newValues);
  }

  const { config } = usePrepareContractWrite({
    address: TicketFactory,
    abi: TicketABI.output.abi,
    functionName: 'createTicket',
    args: [
      formValues.supply || '',
      ethers.utils.parseEther(formValues.price?.toString() || '0'),
      ethers.BigNumber.from(
        Math.floor(startDate.getTime() / 1000).toString() || ''
      ),
      ethers.BigNumber.from(
        Math.floor(endDate.getTime() / 1000).toString() || ''
      ),
      metaDataLink || '',
      {
        gasLimit: 1300000,
      },
    ],
  });

  const {
    data: useContractWriteData,
    write,
    isError: useContractWriteError,
  } = useContractWrite(config);

  useEffect(() => {
    if (useContractWriteError) {
      removeNotification();
      setIsLoading(false);
    }
  }, [useContractWriteError]);

  const {
    data: useWaitForTransactionData,
    isSuccess,
    isFetching,
    isError,
  } = useWaitForTransaction({
    hash: useContractWriteData?.hash,
  });

  useEffect(() => {
    if (!useWaitForTransactionData?.transactionHash) {
      return;
    }
    setMetaDataLink(undefined);
    setImageUrl(undefined);
    setFile(undefined);
    const hash = useWaitForTransactionData?.transactionHash;
    formRef.current?.resetForm();
    setIsLoading(false);
    addNotification({
      status: 'success',
      title: 'Event Creation Successful',
      description: `Your event has been successfully created. Transaction hash: ${hash.slice(
        0,
        6
      )}....${hash.slice(-6)}. You can check your event in the My Events tab.`,
    });
  }, [useWaitForTransactionData?.transactionHash]);

  useEffect(() => {
    if (isError) {
      addNotification({
        status: 'error',
        title: 'Something went wrong',
        description: `Transaction failed`,
      });
    }
  }, [isError]);

  useEffect(() => {
    if (
      isFetching &&
      metaDataLink &&
      formValues.supply &&
      formValues.price &&
      startDate &&
      endDate
    ) {
      addNotification({
        status: 'info',
        title: 'Waiting for confirmation',
        description: `Transaction hash: ${useContractWriteData?.hash.slice(
          0,
          6
        )}....${useContractWriteData?.hash.slice(-6)}`,
      });
    }
  }, [isFetching]);

  const handleSubmit = async (values: FormikValues) => {
    if (write) {
      write?.();
    }
  };

  const onDrop = useCallback((acceptedFiles: any) => {
    console.log(acceptedFiles);
    if (acceptedFiles) {
      const file = acceptedFiles[0];
      if (file) {
        setFile(file);
        setImageUrl(URL.createObjectURL(file));
      }
    }
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragAccept,
    isDragReject,
    isDragActive,
  } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
    },
  });

  const handleRemoveImage = () => {
    setImageUrl(undefined);
    setFile(undefined);
  };

  const handleUpload = async () => {
    setIsLoading(true);
    addNotification({
      status: 'info',
      title: 'Uploading metadata to IPFS',
    });
    const formData = new FormData();
    if (file) {
      formData.append('image', file);
    }
    if (formValues.name) {
      formData.append('name', formValues.name);
    }
    if (formValues.description) {
      formData.append('description', formValues.description);
    }
    try {
      const res = await axios.post('/api/event/metadata', formData);
      setMetaDataLink(res.data.postMetaData);
      addNotification({
        status: 'success',
        title: 'IPFS upload successful, initiating minting process...',
      });

      setTimeout(() => {
        if (buttonRef?.current) {
          buttonRef.current.click();
        }
      }, 1000);
      // window.scrollTo(0, document.body.scrollHeight);
    } catch (error) {
      addNotification({
        status: 'error',
        title: 'Error',
        description: (error as Error).message,
        autoClose: true,
      });
      setIsLoading(false);
    }
  };
  const router = useRouter();
  const validate = (values: FormikValues) => {
    const errors: FormikValues = {};
    if (!values.name) {
      errors.name = '*Name is required';
    }
    if (!values.description) {
      errors.description = '*Description is required';
    }
    if (!values.supply) {
      errors.supply = '*Total supply is required';
    } else if (values.supply < 0) {
      errors.supply = '*Total supply should be greater than 0';
    } else if (!Number.isInteger(Number(values.supply))) {
      errors.supply = '*Total supply should be a whole number';
    }

    if (!values.price) {
      errors.price = '*Ticket price is required';
    } else if (values.price < 0) {
      errors.price = '*Ticket price should be greater than 0';
    }
    if (!startDate) {
      errors.start = '*Start date is required';
    }
    if (!endDate) {
      errors.end = '*End date is required';
    }
    if (!file) {
      errors.image = '*Cover image is required';
    }
    return errors;
  };

  return (
    <Flex direction="column">
      <Button mb={4} onClick={() => router.back()} w="fit-content">
        <FiArrowLeft />
      </Button>
      <Box
        width="full"
        maxWidth="2xl"
        px={8}
        py={4}
        bg="gray.900"
        borderRadius="md"
        borderWidth="1px"
      >
        <Text fontSize="xl" my={4} fontWeight="bold">
          Create Your Own Event
        </Text>
        <Box display="flex" alignItems="center" mb={4}>
          <Text color="gray.500" mt={2} mb={4}>
            Please fill in the following fields to create your event as an
            ERC-1155 NFT Token. Mint your NFT using the form below.
          </Text>
        </Box>
        <Formik
          innerRef={formRef}
          initialValues={{
            name: '',
            description: '',
            supply: '',
            price: '',
            image: '',
            start: '',
            end: '',
          }}
          onSubmit={handleSubmit}
          validate={validate}
        >
          {(formik) => (
            <Form>
              <Logger onValuesChanged={handleFormValuesChange} />
              <Field name="name">
                {({ field, form }: { field: any; form: any }) => (
                  <FormControl
                    mt={4}
                    isInvalid={form.errors.name && form.touched.name}
                  >
                    {/* <FormLabel>Name</FormLabel> */}
                    <Input
                      {...field}
                      _placeholder={{ color: 'gray.500' }}
                      type="text"
                      size="lg"
                      mb="4"
                      autoComplete="off"
                      focusBorderColor="green.400"
                      // variant="flushed"
                      placeholder="Enter event name"
                    />
                    {form.errors.name && form.touched.name && (
                      <Text color="red.500">{form.errors.name}</Text>
                    )}
                  </FormControl>
                )}
              </Field>
              <Field name="description">
                {({ field, form }: { field: any; form: any }) => (
                  <FormControl
                    mt={4}
                    isInvalid={
                      form.errors.description && form.touched.description
                    }
                  >
                    {/* <FormLabel>Description</FormLabel> */}
                    <Textarea
                      {...field}
                      _placeholder={{ color: 'gray.500' }}
                      type="text"
                      size="lg"
                      mb="4"
                      height="fit-content"
                      autoComplete="off"
                      focusBorderColor="green.400"
                      // variant="flushed"
                      placeholder="Enter event description"
                    />
                    {form.errors.description && form.touched.description && (
                      <Text color="red.500">{form.errors.description}</Text>
                    )}
                  </FormControl>
                )}
              </Field>
              <Field name="supply">
                {({ field, form }: { field: any; form: any }) => (
                  <FormControl
                    mt={4}
                    isInvalid={form.errors.supply && form.touched.supply}
                  >
                    {/* <FormLabel>Total Supply</FormLabel> */}
                    <Input
                      {...field}
                      _placeholder={{ color: 'gray.500' }}
                      type="number"
                      size="lg"
                      autoComplete="off"
                      mb="4"
                      focusBorderColor="green.400"
                      // variant="flushed"
                      placeholder="Enter total ticket supply"
                    />
                    {form.errors.supply && form.touched.supply && (
                      <Text color="red.500">{form.errors.supply}</Text>
                    )}
                  </FormControl>
                )}
              </Field>
              <Field name="price">
                {({ field, form }: { field: any; form: any }) => (
                  <FormControl
                    mt={4}
                    isInvalid={form.errors.price && form.touched.price}
                  >
                    {/* <FormLabel>Ticket Price (in ETH)</FormLabel> */}
                    <Input
                      {...field}
                      _placeholder={{ color: 'gray.500' }}
                      type="number"
                      autoComplete="off"
                      size="lg"
                      mb="4"
                      focusBorderColor="green.400"
                      // variant="flushed"
                      placeholder="Enter price per ticket (ETH)"
                    />
                    {form.errors.price && form.touched.price && (
                      <Text color="red.500">{form.errors.price}</Text>
                    )}
                  </FormControl>
                )}
              </Field>
              <Field name="image">
                {({ field, form }: { field: any; form: any }) => (
                  <FormControl
                    my={6}
                    isInvalid={!file && form.errors.image && form.touched.image}
                  >
                    <FormLabel fontSize="lg">
                      Upload Event Cover Image
                    </FormLabel>
                    <Text color="gray.500">
                      Event cover image will be displayed to buyers.
                    </Text>

                    <>
                      {!file && !imageUrl && (
                        <Box
                          {...getRootProps()}
                          w="full"
                          mt={4}
                          bg="gray.900"
                          borderRadius="md"
                          justifyContent="center"
                          borderWidth={1}
                          borderStyle={isDragActive ? 'dashed' : 'solid'}
                          borderColor={
                            isDragAccept
                              ? 'green.400'
                              : isDragReject
                              ? 'red.500'
                              : 'gray.700'
                          }
                          alignItems="center"
                          cursor="pointer"
                          p={4}
                        >
                          <Input
                            type="file"
                            {...field}
                            {...getInputProps()}
                            accept="image/*"
                            placeholder="Choose an image"
                          />
                          {isDragAccept && (
                            <Text color="white" textAlign="center">
                              Drop your image here
                            </Text>
                          )}
                          {isDragReject && (
                            <Text color="red" textAlign="center">
                              File type not supported
                            </Text>
                          )}
                          {!isDragActive && (
                            <Text textAlign="center">
                              Drag and drop an image file here or click to
                              browse
                            </Text>
                          )}
                          <Box
                            mt={4}
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                          >
                            <BsCardImage size={48} />
                          </Box>
                        </Box>
                      )}

                      {imageUrl && (
                        <Box mt={4}>
                          <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="flex-start"
                            position="relative"
                          >
                            <Box
                              w="full"
                              borderWidth="1px"
                              borderRadius="md"
                              overflow="hidden"
                            >
                              <Image
                                src={imageUrl}
                                w="full"
                                h="full"
                                objectFit="cover"
                              />
                            </Box>

                            <Box
                              position="absolute"
                              top="4"
                              right="4"
                              padding={2}
                              onClick={handleRemoveImage}
                              cursor="pointer"
                              backgroundColor="rgba(0, 0, 0, 0.5)"
                              borderRadius="50%"
                              transition="background-color 0.2s"
                              _hover={{
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                              }}
                            >
                              <MdClose style={{ fontSize: '32px' }} />
                            </Box>
                          </Box>
                        </Box>
                      )}
                    </>

                    {!file && form.errors.image && form.touched.image && (
                      <Text mt={4} color="red.500">
                        {form.errors.image}
                      </Text>
                    )}
                  </FormControl>
                )}
              </Field>
              <Field name="start">
                {({ field, form }: { field: any; form: any }) => (
                  <FormControl mt={4} isInvalid={form.errors.start}>
                    <FormLabel>Event Start Date & Time</FormLabel>
                    <DatePicker
                      selected={startDate}
                      onChange={(date: any) => setStartDate(date)}
                      showTimeSelect
                      timeIntervals={15}
                      dateFormat="yyyy-MM-dd hh:mm aa"
                      placeholderText="Select date and time"
                      className="form-control"
                    />
                    {form.errors.start && (
                      <Text mt={4} color="red.500">
                        {form.errors.start}
                      </Text>
                    )}
                  </FormControl>
                )}
              </Field>
              <Field name="end">
                {({ field, form }: { field: any; form: any }) => (
                  <FormControl mt={4} isInvalid={form.errors.end}>
                    <FormLabel>Event End Date & Time</FormLabel>
                    <DatePicker
                      selected={endDate}
                      onChange={(date: any) => setEndDate(date)}
                      showTimeSelect
                      timeIntervals={15}
                      dateFormat="yyyy-MM-dd hh:mm aa"
                      placeholderText="Select date and time"
                      className="form-control"
                    />
                    {form.errors.end && (
                      <Text mt={4} color="red.500">
                        {form.errors.end}
                      </Text>
                    )}
                  </FormControl>
                )}
              </Field>
              <Box display="flex" justifyContent="flex-end" mt={8}>
                {
                  <Button
                    onClick={() => {
                      formik.validateForm().then((errors) => {
                        formik.setTouched(
                          Object.keys(formik.values).reduce(
                            (acc, key) => ({ ...acc, [key]: true }),
                            {}
                          )
                        );
                        formik.setErrors(errors);
                        if (isEmpty(errors)) {
                          handleUpload();
                        }
                      });
                    }}
                    colorScheme="green"
                    isLoading={isLoading}
                  >
                    Mint Event
                  </Button>
                }
                {
                  <Button
                    type="submit"
                    colorScheme="green"
                    isLoading={isFetching}
                    ref={buttonRef}
                    display="none"
                  >
                    Mint Event
                  </Button>
                }
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Flex>
  );
}

export default CreateEvent;
