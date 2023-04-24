import { Box, Icon, Text, useBreakpointValue } from '@chakra-ui/react';
import Link from 'next/link';
import {
  AiOutlineBell,
  AiOutlineCalendar,
  AiOutlineHome,
  AiOutlineUser,
} from 'react-icons/ai';
import { FaTwitter } from 'react-icons/fa';
import { IoTicketOutline } from 'react-icons/io5';
import { MdMailOutline } from 'react-icons/md';
import { RiFileList3Line } from 'react-icons/ri';
import { useAccount } from 'wagmi';

function Sidebar() {
  const displaySidebar = useBreakpointValue({ base: 'none', md: 'block' });
  const { address } = useAccount();
  return (
    <Box
      as="nav"
      h="full"
      width="275px"
      display={displaySidebar}
      pos="relative"
    >
      <Box pos="fixed">
        <Link href="/">
          <SidebarLink icon={AiOutlineHome}>Home</SidebarLink>
        </Link>
        <Link href={`/profile/${address}`}>
          <SidebarLink icon={AiOutlineUser}>Profile</SidebarLink>
        </Link>
        <Link href="/events">
          <SidebarLink icon={AiOutlineCalendar}>Events</SidebarLink>
        </Link>
        <Link href="/events">
          <SidebarLink icon={IoTicketOutline}>My Tickets</SidebarLink>
        </Link>
      </Box>
    </Box>
  );
}

function SidebarLink({ icon, children }: { icon: any; children: any }) {
  return (
    <Box display="flex" py="4" borderRadius="9999px" cursor="pointer">
      <Icon as={icon} w="8" h="8" mr="4" />
      <Text fontWeight="bold" fontSize="lg">
        {children}
      </Text>
    </Box>
  );
}

export default Sidebar;
