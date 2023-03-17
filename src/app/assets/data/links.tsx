import { FaHome } from "react-icons/fa";
import { BsTicketPerforated, BsWallet2, BsClipboardPulse, BsBuildings } from "react-icons/bs";
import { TbBrandAppleArcade } from "react-icons/tb";
import { FiUsers } from 'react-icons/fi'

export const links = [
  { name: 'Inicio', url: '/', chevron: false, icon: <FaHome size={20} strokeWidth={0} /> },
  // { name: 'Rifas', url: '/rifas', chevron: true, icon: <BsTicketPerforated size={20} strokeWidth={0} /> },
  { name: 'Usuarios', url: '/users', chevron: false, icon: <FiUsers size={20} strokeWidth={1.5} /> },
  { name: 'Mis Agencias', url: '/agencies', description: '¡Nuevo!', descriptionColor: 'blue', descriptionSize: 9.5, chevron: false, icon: <BsBuildings size={20} strokeWidth={0} /> },
  { name: 'Operadoras', url: '/operadora', description: '¡Nuevo!', descriptionColor: 'blue', descriptionSize: 9.5, chevron: false, icon: <TbBrandAppleArcade size={20} strokeWidth={1.3} /> },
  { name: 'Wallet', description: '¡Nuevo!', descriptionColor: 'blue', descriptionSize: 9.5, url: '/wallet', chevron: false, icon: <BsWallet2 size={20} strokeWidth={0} /> },
  { name: 'Estado del Sistema', url: '/health', description: '¡Nuevo!', descriptionColor: 'blue', descriptionSize: 9.5, chevron: false, icon: <BsClipboardPulse size={20} strokeWidth={0} /> },
]