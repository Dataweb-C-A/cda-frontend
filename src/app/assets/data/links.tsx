import { FaHome } from "react-icons/fa";
import { BsWallet2, BsBuilding, BsJoystick} from "react-icons/bs";
import { BiMoney } from "react-icons/bi";
import { TbBrandAppleArcade } from "react-icons/tb";
import { FiUsers } from 'react-icons/fi'
import { MdAttachMoney, MdSupportAgent } from "react-icons/md";
import { IconNotes } from '@tabler/icons-react';
import { IconBrandGoogleAnalytics  } from '@tabler/icons-react';
import { IconPokerChip } from "@tabler/icons"; 
import { IconHomePlus } from '@tabler/icons-react';
import { IconMath1Divide2 } from '@tabler/icons-react';
const user = JSON.parse(localStorage.getItem('user') || '{}');
let is5050User = false;

if (typeof user.name === 'string') {
  is5050User = user.name.substring(0, 5) === "50 50";
}

export const links = [
  { name: 'Lobby', url: '/', chevron: false, icon: <FaHome size={20} strokeWidth={0} />  },
  { name: 'Lobby  50 y 50', url: '/', chevron: false, icon: <FaHome size={20} strokeWidth={0} />  },
  { name: 'Rifamax', url: '/rifamax', chevron: false, icon: <BsJoystick size={20} strokeWidth={0} /> },
  { name: 'Reportes 50 y 50', url: '/reportes50y50', chevron: false, icon: <IconMath1Divide2 size={20} strokeWidth={1.5} />, hidden: !is5050User },
  { name: 'Taquilla 50 y 50', url: '/New50y50t', chevron: false, icon: <IconHomePlus size={20} strokeWidth={1.5} />, hidden: !is5050User },
  { name: 'Riferos', url: '/riferos', chevron: false, icon: <FiUsers size={20} strokeWidth={1.5} />, role: 'Taquilla' },
  { name: 'Reportes de rifas', url: '/reportes-rifa', chevron: false, icon: <IconNotes size={20} strokeWidth={1.5} />, role: 'Taquilla' },
  // { name: 'Taquilla Rifamax', url: '/lobby', description: '¡Nuevo!', descriptionColor: 'blue', descriptionSize: 9.5, chevron: false, icon: <TbBrandAppleArcade size={20} strokeWidth={1.3} />, role: 'Taquilla' },
  // { name: 'Cuadre', url: '/cuadre',description: '¡Nuevo!',descriptionColor: 'blue', descriptionSize: 9.5, chevron: false, icon: <IconBrandGoogleAnalytics size={20} strokeWidth={1.5} />, role: 'Taquilla' },
 { name: 'Rifamax 50 y 50', url: '/infinito', description: '¡Nuevo!',descriptionColor: 'blue', descriptionSize: 9.5, chevron: false, icon: <IconPokerChip size={20} strokeWidth={1.5} />, role: 'Taquilla'},
  { name: 'Reportes', url: '/reports', description: '¡Nuevo!', descriptionColor: 'blue', descriptionSize: 9.5, chevron: false, icon: <BsBuilding size={20} strokeWidth={0} />, role: 'Admin' },
  // { name: 'Rifas', url: '/rifas', chevron: true, icon: <BsTicketPerforated size={20} strokeWidth={0} /> },
  // { name: 'Usuarios', url: '/users', chevron: false, icon: <FiUsers size={20} strokeWidth={1.5} /> },
 // { name: 'Agentes', url: '/agencies', description: '¡Nuevo!', descriptionColor: 'blue', descriptionSize: 9.5, chevron: false, icon: <MdSupportAgent size={20} strokeWidth={0} />, role: 'Admin' },
  // { name: 'Operadora', url: '/draws', description: '¡Nuevo!', descriptionColor: 'blue', descriptionSize: 9.5, chevron: false, icon: <BiMoney size={20} strokeWidth={0} />, role: 'Admin' },
  { name: 'Monedas', url: '/exchange', description: '¡Nuevo!', descriptionColor: 'blue', descriptionSize: 9.5, chevron: false, icon: <MdAttachMoney size={20} />, role: 'Admin' },
  // { name: 'Wallet', description: '¡Nuevo!', descriptionColor: 'blue', descriptionSize: 9.5, url: '/wallet', chevron: false, icon: <BsWallet2 size={20} strokeWidth={0} /> },
  // { name: 'Estado del Sistema', url: '/health', description: '¡Nuevo!', descriptionColor: 'blue', descriptionSize: 9.5, chevron: false, icon: <BsClipboardPulse size={20} strokeWidth={0} /> },
]