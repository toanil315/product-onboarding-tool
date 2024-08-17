import {
  FinanceManagerIcon,
  ProjectEngineerIcon,
  SiteWorkerIcon,
  SubContractorIcon,
  SuperVisorIcon,
  OfficeWorkerIcon,
} from "@/components/Icons";

export const PERSONA_OPTIONS = [
  {
    label: "Site Worker (Wages)",
    value: "SITE_WORKER",
    icon: <SiteWorkerIcon />,
  },
  {
    label: "Supervisor",
    value: "SUPERVISOR",
    icon: <SuperVisorIcon />,
  },
  {
    label: "Engineer",
    value: "PROJECT_ENGINEER",
    icon: <ProjectEngineerIcon />,
  },
  {
    label: "Sub-contractor",
    value: "SUB_CONTRACTOR",
    icon: <SubContractorIcon />,
  },
  {
    label: "Finance Manager",
    value: "FINANCE_MANAGER",
    icon: <FinanceManagerIcon />,
  },
  {
    label: "Office Worker",
    value: "OFFICE_WORKER",
    icon: <OfficeWorkerIcon />,
  },
];
