# System Permission Registry & RBAC Matrix

## Role Hierarchy

1. **SUPER_ADMIN**: Platform administrator (bypasses tenant filters).
2. **CLINIC_ADMIN**: Manage organization settings, staff, locations, departments.
3. **DOCTOR**: Manage encounters, vitals, care plans, prescriptions, lab orders, documents.
4. **NURSE**: Record vitals, view patient records, update assigned care plan tasks.
5. **RECEPTIONIST**: Register patients, schedule/reschedule/cancel appointments, check-in.
6. **BILLING_OFFICER**: Manage invoices, record payments, process refunds.
7. **LAB_TECHNICIAN**: View lab orders, enter test results with reference ranges and abnormal flags.
8. **PATIENT**: Scoped strictly to own medical records, appointments, care plans, and invoices.
