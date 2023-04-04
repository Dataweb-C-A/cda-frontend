import { useState, useEffect } from "react";
import {
  Modal,
  Text,
  Card,
  Stepper,
  Divider,
  Box,
  TextInput
} from '@mantine/core'
import {
  useForm,
  isNotEmpty,
} from '@mantine/form'
import axios from 'axios'
import { useUser } from "../../hooks/useUser";

type RiferosModalProps = {
  variant?: "filled" | "outline" | "light" | "gradient" | "white" | "default" | "subtle";
  color: 'blue' | 'red' | 'green' | 'yellow' | 'teal' | 'pink' | 'gray' | 'violet' | 'indigo' | 'cyan' | 'orange';
  style: object;
  className: string;
  leftIcon?: React.ReactNode;
  disabled?: boolean | false;
  children?: React.ReactNode;
}

type RiferosProps = {
  
}