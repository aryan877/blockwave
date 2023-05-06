import { Avatar, AvatarBadge, Badge, VStack } from '@chakra-ui/react';
import { css } from '@emotion/react';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useAccount, useContractRead } from 'wagmi';
import { ProfileImage } from '../abi/address';
import ProfileABI from '../abi/ProfileImage.json';

interface CustomAvatarProps {
  size?: string;
  user: any;
  showBadge?: boolean;
  mr?: number;
  borderWidthRegularImage?: number;
  borderWidthNFTImage?: number;
}

const hexagonStyle = css`
clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
border: '4px solid #34D399',
backgroundRepeat: 'no-repeat',
backgroundPosition: 'center center',
backgroundSize: 'cover',
`;

const CustomAvatar: React.FC<CustomAvatarProps> = ({
  size = 'md',
  user,
  showBadge,
  mr = 0,
  borderWidthRegularImage = 0,
  borderWidthNFTImage = 2,
}) => {
  //verify ownership of NFT image for profile picture
  const { data: useContractReadOwner } = useContractRead({
    address: ProfileImage,
    abi: ProfileABI.output.abi,
    functionName: 'ownerOf',
    args: [user.nftId],
  });
  const [isNftHolder, SetIsNftHolder] = useState(false);

  useEffect(() => {
    if (
      user &&
      useContractReadOwner === user._id &&
      !isEmpty(user._id) &&
      !isEmpty(useContractReadOwner) &&
      user.nftId >= 0
    ) {
      SetIsNftHolder(true);
    } else {
      SetIsNftHolder(false);
    }
  }, [useContractReadOwner, user]);

  return (
    <>
      <Avatar
        name={user?.name}
        size={size}
        mr={mr}
        src={user.profileImage}
        borderWidth={
          isNftHolder ? borderWidthNFTImage : borderWidthRegularImage
        }
        borderStyle="solid"
        borderColor={isNftHolder ? 'green.200' : 'white'}
        borderRadius={isNftHolder ? 0 : 'full'}
        css={isNftHolder && hexagonStyle}
      />
      {isNftHolder && showBadge && (
        <Badge colorScheme="green">NFT Profile</Badge>
      )}
    </>
  );
};

export default CustomAvatar;
