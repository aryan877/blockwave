import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Image,
  Input,
  Text,
} from '@chakra-ui/react';
import axios from 'axios';
import BigNumber from 'bignumber.js';
import { Field, Form, Formik, FormikHelpers, FormikValues } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { IoImagesOutline } from 'react-icons/io5';
import { MdClose } from 'react-icons/md';
import { start } from 'repl';
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
  const { addNotification } = useNotification();
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

  const [formValues, setFormValues] = useState<FormikValues>({});
  function handleFormValuesChange(newValues: FormikValues) {
    setFormValues(newValues);
  }
  const handleSubmit = async (values: FormikValues) => {
    if (write) {
      setIsLoading(true);
      write?.();
    }
  };

  const { config } = usePrepareContractWrite({
    address: TicketFactory,
    abi: TicketABI.output.abi,
    functionName: 'createTicket',
    args: [
      formValues.supply,
      formValues.price,
      Math.floor(startDate.getTime() / 1000),
      Math.floor(endDate.getTime() / 1000),
      metaDataLink,
      {
        gasLimit: 1300000,
      },
    ],
  });

  const {
    data: useContractWriteData,
    write,
    isError,
  } = useContractWrite(config);

  const {
    data: useWaitForTransactionData,
    isSuccess,
    isFetching,
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
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.value = '';
    const hash = useWaitForTransactionData?.transactionHash;
    formRef.current?.resetForm();
    addNotification({
      status: 'success',
      title: 'Event Creation Successful',
      description: `Your event has been successfully created. Transaction hash: ${hash}`,
    });

    setIsLoading(false);
  }, [useWaitForTransactionData?.transactionHash]);

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
      });
    }
  }, [isFetching]);

  useEffect(() => {
    if (isError) {
      setIsLoading(false);
    }
  }, [isError]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const file = files[0];
      if (file) {
        setFile(file);
        setImageUrl(URL.createObjectURL(file));
      }
    }
  };

  const handleRemoveImage = () => {
    setImageUrl(undefined);
    setFile(undefined);
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.value = '';
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
    formData.append('address', address as string);
    try {
      const res = await axios.post('/api/event/metadata', formData);
      setMetaDataLink(res.data.postMetaData);
      addNotification({
        status: 'success',
        title: 'Upload to IPFS successful, now MINT below',
      });
      window.scrollTo(0, document.body.scrollHeight);
      setIsLoading(false);
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
    } else if (values.supply < 1) {
      errors.supply = '*Total supply should be greater than 0';
    }
    if (!values.price) {
      errors.price = '*Ticket price is required';
    } else if (values.price < 1) {
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
    <>
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
            Please fill in the following fields to create your event. There are
            two steps to complete this process: first, upload your event
            metadata to IPFS; second, mint your event NFT using the form below.
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
                      variant="flushed"
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
                    <Input
                      {...field}
                      _placeholder={{ color: 'gray.500' }}
                      type="text"
                      size="lg"
                      mb="4"
                      autoComplete="off"
                      focusBorderColor="green.400"
                      variant="flushed"
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
                      variant="flushed"
                      placeholder="Enter total tickets"
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
                      variant="flushed"
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

                    {/* <InputGroup> */}
                    <>
                      <Button
                        as="label"
                        htmlFor="fileInput"
                        variant="custom"
                        backgroundColor="green.200"
                        cursor="pointer"
                        minWidth="0"
                        color="#000"
                        mt="2"
                        _hover={{ backgroundColor: 'green.300' }}
                        _active={{ backgroundColor: 'green.400' }}
                      >
                        Choose Image
                        <Input
                          id="fileInput"
                          type="file"
                          {...field}
                          accept="image/*"
                          placeholder="Choose an image"
                          onChange={handleFileChange}
                          style={{ display: 'none' }}
                        />
                      </Button>
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
                {!metaDataLink && (
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
                        if (Object.keys(errors).length === 0) {
                          handleUpload();
                        }
                      });
                    }}
                    colorScheme="green"
                    isLoading={isLoading}
                  >
                    Upload to IPFS
                  </Button>
                )}
                {metaDataLink && (
                  <Button
                    type="submit"
                    colorScheme="green"
                    isLoading={isLoading}
                  >
                    Mint Event
                  </Button>
                )}
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
}

export default CreateEvent;
