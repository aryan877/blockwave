import { Box, Icon, Text, useBreakpointValue } from '@chakra-ui/react';
import Link from 'next/link';
import {
  AiOutlineBell,
  AiOutlineFire,
  AiOutlineHome,
  AiOutlinePlus,
  AiOutlineProfile,
  AiOutlineUser,
} from 'react-icons/ai';
import { BiCalendarEvent, BiParty } from 'react-icons/bi';
import { BsBag } from 'react-icons/bs';
import { FaTwitter } from 'react-icons/fa';
import { IoClipboardOutline, IoTicketOutline } from 'react-icons/io5';
import { MdMailOutline } from 'react-icons/md';
import { RiFileList3Line } from 'react-icons/ri';
import { useAccount } from 'wagmi';

import { TiTicket } from 'react-icons/ti';

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
      mr={8}
    >
      <Box pos="fixed">
        <Link href="/">
          <SidebarLink icon={AiOutlineHome}>Home</SidebarLink>
        </Link>
        <Link href={`/profile/${address}`}>
          <SidebarLink icon={AiOutlineUser}>Profile</SidebarLink>
        </Link>
        <Link href="/events">
          <SidebarLink icon={AiOutlineFire}>Browse Events</SidebarLink>
        </Link>
        <Link href="/create-event">
          <SidebarLink icon={AiOutlinePlus}>Mint Event</SidebarLink>
        </Link>
        <Link href="/my-tickets">
          <SidebarLink icon={BsBag}>My Tickets</SidebarLink>
        </Link>
        <Link href="/my-events">
          <SidebarLink icon={BiParty}>My Events</SidebarLink>
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
