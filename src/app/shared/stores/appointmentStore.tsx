import { createElement, Fragment, type ReactNode } from 'react';
import { create } from 'zustand';

export type ApptStatus = 'pending_doctor' | 'pending_patient' | 'confirmed' | 'completed' | 'disputed' | 'rejected' | 'cancelled';
export type ApptMode = 'online' | 'offline';
export type DisputeBy = 'doctor' | 'patient';
export type DisputeResolution = 'completed' | 'cancelled';

export interface ApptDispute {
  reason: string;
  by: DisputeBy;
  filedAt: string;
  previousStatus: ApptStatus;
  resolution?: DisputeResolution;
  resolutionNote?: string;
  resolvedAt?: string;
  resolvedBy?: 'admin';
}

export interface SharedAppt {
  id: number;
  patientName: string;
  patientDiagnosis: string;
  doctorName: string;
  date: string;
  time: string;
  mode: ApptMode;
  topic: string;
  status: ApptStatus;
  createdBy: 'doctor' | 'patient';
  notes: string;
  dispute?: ApptDispute;
}

export const DEMO_PATIENT_NAME = 'Nguyễn Văn A';
export const DEMO_PATIENT_DIAGNOSIS = 'Tiểu đường type 2';
export const DEMO_DOCTOR_NAME = 'BS. Trần Thị A';

const nowStamp = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const INITIAL: SharedAppt[] = [
  { id: 10, patientName: 'Nguyễn Văn A', patientDiagnosis: 'Tiểu đường type 2', doctorName: DEMO_DOCTOR_NAME, date: '28/05/2026', time: '15:00', mode: 'online', topic: 'Đánh giá tiến trình giảm cân', status: 'pending_doctor', createdBy: 'patient', notes: 'Muốn trao đổi về kết quả xét nghiệm gần nhất' },
  { id: 11, patientName: 'Nguyễn Văn A', patientDiagnosis: 'Tiểu đường type 2', doctorName: DEMO_DOCTOR_NAME, date: '05/06/2026', time: '09:30', mode: 'offline', topic: 'Tư vấn thực đơn ăn chay', status: 'pending_doctor', createdBy: 'patient', notes: '' },
  { id: 12, patientName: 'Nguyễn Văn A', patientDiagnosis: 'Tiểu đường type 2', doctorName: DEMO_DOCTOR_NAME, date: '02/06/2026', time: '10:00', mode: 'online', topic: 'Bác sĩ đề xuất kiểm tra HbA1c', status: 'pending_patient', createdBy: 'doctor', notes: 'Cần kiểm tra chỉ số đường huyết dài hạn' },
  { id: 13, patientName: 'Nguyễn Văn A', patientDiagnosis: 'Tiểu đường type 2', doctorName: DEMO_DOCTOR_NAME, date: '04/06/2026', time: '14:00', mode: 'offline', topic: 'Bác sĩ hẹn lấy máu xét nghiệm mỡ máu', status: 'pending_patient', createdBy: 'doctor', notes: 'Nhịn ăn trước 8 tiếng' },
  { id: 14, patientName: 'Nguyễn Văn A', patientDiagnosis: 'Tiểu đường type 2', doctorName: DEMO_DOCTOR_NAME, date: '21/05/2026', time: '15:00', mode: 'online', topic: 'Tái khám định kỳ', status: 'confirmed', createdBy: 'doctor', notes: '' },
  { id: 15, patientName: 'Nguyễn Văn A', patientDiagnosis: 'Tiểu đường type 2', doctorName: DEMO_DOCTOR_NAME, date: '05/06/2026', time: '09:00', mode: 'online', topic: 'Tư vấn chế độ ăn', status: 'confirmed', createdBy: 'patient', notes: '' },
  { id: 16, patientName: 'Nguyễn Văn A', patientDiagnosis: 'Tiểu đường type 2', doctorName: DEMO_DOCTOR_NAME, date: '14/05/2026', time: '15:00', mode: 'online', topic: 'Tái khám định kỳ', status: 'completed', createdBy: 'doctor', notes: '' },
  { id: 17, patientName: 'Nguyễn Văn A', patientDiagnosis: 'Tiểu đường type 2', doctorName: DEMO_DOCTOR_NAME, date: '07/05/2026', time: '14:30', mode: 'online', topic: 'Tư vấn đầu vào', status: 'completed', createdBy: 'patient', notes: '' },
  { id: 18, patientName: 'Nguyễn Văn A', patientDiagnosis: 'Tiểu đường type 2', doctorName: DEMO_DOCTOR_NAME, date: '01/05/2026', time: '10:00', mode: 'offline', topic: 'Kiểm tra tổng quát', status: 'completed', createdBy: 'patient', notes: '' },

  { id: 1, patientName: 'Trần Thị B', patientDiagnosis: 'Tăng huyết áp', doctorName: DEMO_DOCTOR_NAME, date: '06/06/2026', time: '14:00', mode: 'offline', topic: 'Tư vấn thực đơn ăn chay', status: 'pending_doctor', createdBy: 'patient', notes: '' },
  { id: 2, patientName: 'Lê Văn C', patientDiagnosis: 'Cholesterol cao', doctorName: DEMO_DOCTOR_NAME, date: '07/06/2026', time: '10:30', mode: 'online', topic: 'Tái khám sau điều trị', status: 'pending_doctor', createdBy: 'patient', notes: 'Chóng mặt sau khi uống thuốc.' },
  { id: 4, patientName: 'Phạm Thị D', patientDiagnosis: 'Béo phì độ I', doctorName: DEMO_DOCTOR_NAME, date: '08/06/2026', time: '15:00', mode: 'online', topic: 'Kiểm tra HbA1c định kỳ', status: 'pending_patient', createdBy: 'doctor', notes: 'Cần kiểm tra chỉ số đường huyết dài hạn.' },
  { id: 5, patientName: 'Hoàng Văn E', patientDiagnosis: 'Rối loạn lipid máu', doctorName: DEMO_DOCTOR_NAME, date: '09/06/2026', time: '08:30', mode: 'offline', topic: 'Xét nghiệm mỡ máu', status: 'pending_patient', createdBy: 'doctor', notes: 'Bệnh nhân cần nhịn ăn trước 8 tiếng.' },
  { id: 7, patientName: 'Vũ Thị F', patientDiagnosis: 'Tiểu đường type 2', doctorName: DEMO_DOCTOR_NAME, date: '10/06/2026', time: '11:00', mode: 'online', topic: 'Tư vấn dinh dưỡng cá nhân hoá', status: 'confirmed', createdBy: 'doctor', notes: '' },
  { id: 8, patientName: 'Trần Thị B', patientDiagnosis: 'Tăng huyết áp', doctorName: DEMO_DOCTOR_NAME, date: '12/06/2026', time: '14:30', mode: 'online', topic: 'Kiểm tra huyết áp định kỳ', status: 'confirmed', createdBy: 'doctor', notes: '' },

  { id: 20, patientName: 'Lê Văn C', patientDiagnosis: 'Cholesterol cao', doctorName: DEMO_DOCTOR_NAME, date: '02/06/2026', time: '09:00', mode: 'online', topic: 'Tái khám kết quả lipid', status: 'completed', createdBy: 'doctor', notes: '' },
  { id: 21, patientName: 'Đỗ Văn F', patientDiagnosis: 'Tiểu đường type 2', doctorName: DEMO_DOCTOR_NAME, date: '01/06/2026', time: '15:00', mode: 'online', topic: 'Tư vấn dinh dưỡng', status: 'disputed', createdBy: 'doctor', notes: '',
    dispute: { reason: 'Bác sĩ không vào phòng tư vấn online, bệnh nhân chờ 30 phút.', by: 'patient', filedAt: '01/06/2026 15:35', previousStatus: 'confirmed' } },
];

type ApptState = {
  appointments: SharedAppt[];
  addAppointment: (appt: Omit<SharedAppt, 'id'>) => void;
  updateStatus: (id: number, status: ApptStatus) => void;
  updateAppointment: (id: number, updates: Partial<SharedAppt>) => void;
  fileDispute: (id: number, reason: string, by: DisputeBy) => void;
  resolveDispute: (id: number, resolution: DisputeResolution, note?: string) => void;
};

const useApptStore = create<ApptState>((set, get) => ({
  appointments: INITIAL,
  addAppointment: (appt) => set({ appointments: [{ ...appt, id: Date.now() }, ...get().appointments] }),
  updateStatus: (id, status) =>
    set({ appointments: get().appointments.map((a) => (a.id === id ? { ...a, status } : a)) }),
  updateAppointment: (id, updates) =>
    set({ appointments: get().appointments.map((a) => (a.id === id ? { ...a, ...updates } : a)) }),
  fileDispute: (id, reason, by) =>
    set({
      appointments: get().appointments.map((a) =>
        a.id === id
          ? { ...a, status: 'disputed', dispute: { reason, by, filedAt: nowStamp(), previousStatus: a.status } }
          : a,
      ),
    }),
  resolveDispute: (id, resolution, note) =>
    set({
      appointments: get().appointments.map((a) =>
        a.id === id && a.dispute
          ? {
              ...a,
              status: resolution,
              dispute: { ...a.dispute, resolution, resolutionNote: note, resolvedAt: nowStamp(), resolvedBy: 'admin' },
            }
          : a,
      ),
    }),
}));

export const useAppointments = () => {
  const appointments = useApptStore((s) => s.appointments);
  const addAppointment = useApptStore((s) => s.addAppointment);
  const updateStatus = useApptStore((s) => s.updateStatus);
  const updateAppointment = useApptStore((s) => s.updateAppointment);
  const fileDispute = useApptStore((s) => s.fileDispute);
  const resolveDispute = useApptStore((s) => s.resolveDispute);
  return { appointments, addAppointment, updateStatus, updateAppointment, fileDispute, resolveDispute };
};

export function AppointmentProvider({ children }: { children: ReactNode }) {
  return createElement(Fragment, null, children);
}
