import { FaHome } from "react-icons/fa";
import { BsWallet2, BsBuilding } from "react-icons/bs";
import { BiMoney } from "react-icons/bi";
import { TbBrandAppleArcade } from "react-icons/tb";
import { FiUsers } from 'react-icons/fi'
import { MdAttachMoney } from "react-icons/md";
import { IconNotes } from '@tabler/icons-react';

export const links = [
  { name: 'Inicio', url: '/', chevron: false, icon: <FaHome size={20} strokeWidth={0} /> },
  { name: 'Riferos', url: '/riferos', chevron: false, icon: <FiUsers size={20} strokeWidth={1.5} />, role: 'Taquilla' },
  { name: 'Reportes de rifas', url: '/reportes-rifa', chevron: false, icon: <IconNotes size={20} strokeWidth={1.5} />, role: 'Taquilla' },
  { name: 'Reportes', url: '/reports', description: '¡Nuevo!', descriptionColor: 'blue', descriptionSize: 9.5, chevron: false, icon: <BsBuilding size={20} strokeWidth={0} />, role: 'Admin' },
  // { name: 'Rifas', url: '/rifas', chevron: true, icon: <BsTicketPerforated size={20} strokeWidth={0} /> },
  // { name: 'Usuarios', url: '/users', chevron: false, icon: <FiUsers size={20} strokeWidth={1.5} /> },
  // { name: 'Mis Agencias', url: '/agencies', description: '¡Nuevo!', descriptionColor: 'blue', descriptionSize: 9.5, chevron: false, icon: <BsBuildings size={20} strokeWidth={0} /> },
  // { name: 'Lobby', url: '/lobby', description: '¡Nuevo!', descriptionColor: 'blue', descriptionSize: 9.5, chevron: false, icon: <TbBrandAppleArcade size={20} strokeWidth={1.3} />, role: 'Taquilla' },
  { name: 'Operadora', url: '/draws', description: '¡Nuevo!', descriptionColor: 'blue', descriptionSize: 9.5, chevron: false, icon: <BiMoney size={20} strokeWidth={0} />, role: 'Admin' },
  { name: 'Monedas', url: '/exchange', description: '¡Nuevo!', descriptionColor: 'blue', descriptionSize: 9.5, chevron: false, icon: <MdAttachMoney size={20} />, role: 'Admin' },
  // { name: 'Wallet', description: '¡Nuevo!', descriptionColor: 'blue', descriptionSize: 9.5, url: '/wallet', chevron: false, icon: <BsWallet2 size={20} strokeWidth={0} /> },
  // { name: 'Estado del Sistema', url: '/health', description: '¡Nuevo!', descriptionColor: 'blue', descriptionSize: 9.5, chevron: false, icon: <BsClipboardPulse size={20} strokeWidth={0} /> },
]