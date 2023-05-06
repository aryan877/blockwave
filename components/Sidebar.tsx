import { Box, Icon, Text, useBreakpointValue } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  AiFillFire,
  AiFillHome,
  AiOutlineBell,
  AiOutlineFire,
  AiOutlineHome,
  AiOutlinePlus,
  AiOutlineUser,
} from 'react-icons/ai';
import { BiCalendarEvent, BiParty } from 'react-icons/bi';
import { BsBag, BsBagFill, BsFillBagFill } from 'react-icons/bs';
import { GoPlus } from 'react-icons/go';
import { RiUser3Fill, RiUser3Line } from 'react-icons/ri';
import { TbConfetti } from 'react-icons/tb';
import { useAccount } from 'wagmi';

function Sidebar() {
  const router = useRouter();
  const displaySidebar = useBreakpointValue({ base: 'none', md: 'block' });
  const { address } = useAccount();
  return (
    <Box
      as="nav"
      h="full"
      width="275px"
      display={displaySidebar}
      pos="relative"
      mr={8}
    >
      <Box pos="fixed">
        <Link href="/">
          <SidebarLink
            icon={AiOutlineHome}
            activeIcon={AiFillHome}
            isActive={router.pathname === '/'}
          >
            Home
          </SidebarLink>
        </Link>
        <Link href={`/profile/${address}`}>
          <SidebarLink
            activeIcon={RiUser3Fill}
            icon={RiUser3Line}
            isActive={router.pathname.startsWith('/profile/')}
          >
            Profile
          </SidebarLink>
        </Link>
        <Link href="/events">
          <SidebarLink
            icon={AiOutlineFire}
            activeIcon={AiFillFire}
            isActive={router.pathname === '/events'}
          >
            All Events
          </SidebarLink>
        </Link>
        <Link href="/create-event">
          <SidebarLink
            icon={AiOutlinePlus}
            activeIcon={GoPlus}
            isActive={router.pathname === '/create-event'}
          >
            Mint Event
          </SidebarLink>
        </Link>
        <Link href="/my-tickets">
          <SidebarLink
            icon={BsBag}
            activeIcon={BsBagFill}
            isActive={router.pathname === '/my-tickets'}
          >
            My Tickets
          </SidebarLink>
        </Link>
        <Link href="/my-events">
          <SidebarLink
            icon={BiParty}
            activeIcon={BiParty}
            isActive={router.pathname === '/my-events'}
          >
            My Events
          </SidebarLink>
        </Link>
      </Box>
    </Box>
  );
}

function SidebarLink({
  icon,
  activeIcon,
  isActive,
  children,
}: {
  icon: any;
  activeIcon?: any;
  isActive?: boolean;
  children: any;
}) {
  return (
    <Box
      display="flex"
      _hover={{
        bg: 'gray.900',
        transition: 'background-color 0.1s ease-out',
      }}
      py={4}
      px={4}
      my={2}
      borderRadius="9999px"
      cursor="pointer"
    >
      <Icon as={isActive ? activeIcon : icon} w="8" h="8" mr={4} />
      <Text ml={2} fontWeight={isActive ? 'extrabold' : ''} fontSize="lg">
        {children}
      </Text>
    </Box>
  );
}

export default Sidebar;
