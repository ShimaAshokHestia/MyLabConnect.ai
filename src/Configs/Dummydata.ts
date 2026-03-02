/* ============================================================
   data/dummyData.ts
   Dummy API responses for all 6 login roles.
   Replace fetchDashboardData() body with real API GET calls.
   ============================================================ */

import type { CaseRecord, CaseStatus, DashboardPageData, LoginRole } from "../Types/IndexPage.types";

// ─────────────────────────────────────────────────────────────
// Helper — build a case record
// ─────────────────────────────────────────────────────────────
const c = (
  id: string,
  patientName: string,
  patientId: string | undefined,
  caseType: string,
  doctorName: string,
  labName: string,
  date: string,
  status: CaseStatus,
  isRush = false
): CaseRecord => ({ id, patientName, patientId, caseType, doctorName, labName, date, status, isRush });

// ─────────────────────────────────────────────────────────────
// DOCTOR dummy data
// ─────────────────────────────────────────────────────────────
const DOCTOR_DATA: DashboardPageData = {
  role: 'doctor',
  tabCounts: { rejected: 6, hold: 8, transit: 3, production: 12, submitted: 15, recent: 5 },
  cases: {
    rejected: [
      c('MYLS700501', 'JAMES SMITH', 'PID001', 'IOS Case', 'Bedford Demo Doctor', 'MYLAB', '15/01/2026', 'rejected'),
      c('MYLS700502', 'ANNA LEE', 'PID002', 'IOS QC', 'Bedford Demo Doctor', 'MYLAB', '12/01/2026', 'rejected'),
    ],
    hold: [
      c('MYLS700588', 'WILL BIL', 'poiuyt', 'Analog Case', 'Bedford Demo Doctor', 'MYLAB', '29/12/2025', 'hold'),
      c('MYLS700578', 'SHIRLEY WILL', 'pid78345', 'Analog Case', 'TEST JAMES', 'MYLAB', '27/12/2025', 'hold'),
      c('MYLS700568', 'GILL WILL', 'poiuy', 'Analog Case', 'Bedford Demo Doctor', 'MYLAB', '26/12/2025', 'hold'),
      c('MYLS700666', 'FIONA CHURCH', 'pid089', 'Analog Case', 'Bedford Demo Doctor', 'MYLAB', '21/01/2026', 'hold'),
      c('MYLS700642', 'MARY BRANDO', 'PID578998', 'Analog Case', 'MyDentist Demo Doctor', 'MYLAB', '08/01/2026', 'hold'),
      c('MYLS700622', 'VIVIAN RICHARD', 'pid7854', 'Analog Case', 'Bedford Demo Doctor', 'MYLAB', '04/01/2026', 'hold'),
      c('MYLS700642', 'MARY BRANDO', 'PID578998', 'Analog Case', 'MyDentist Demo Doctor', 'MYLAB', '08/01/2026', 'hold'),
      c('MYLS700642', 'MARY BRANDO', 'PID578998', 'Analog Case', 'MyDentist Demo Doctor', 'MYLAB', '08/01/2026', 'hold'),
    ],
    transit: [
      c('MYLS700588', 'WILL BIL', 'poiuyt', 'Analog Case', 'Bedford Demo Doctor', 'MYLAB', '29/12/2025', 'hold'),
      c('MYLS700578', 'SHIRLEY WILL', 'pid78345', 'Analog Case', 'TEST JAMES', 'MYLAB', '27/12/2025', 'hold'),
      c('MYLS700568', 'GILL WILL', 'poiuy', 'Analog Case', 'Bedford Demo Doctor', 'MYLAB', '26/12/2025', 'hold'),
    ],
    production: [
      c('MYLS700600', 'ALICE MORGAN', 'PID100', 'Analog Case', 'Bedford Demo Doctor', 'MYLAB', '18/01/2026', 'production'),
      c('MYLS700601', 'BRIAN COLE', 'PID101', 'IOS Case', 'Bedford Demo Doctor', 'MYLAB', '17/01/2026', 'production', true),
      c('MYLS700602', 'CAROL HUNT', 'PID102', 'Analog Case', 'TEST JAMES', 'MYLAB', '17/01/2026', 'production'),
      c('MYLS700603', 'DAVID PRICE', 'PID103', 'IOS Case', 'Bedford Demo Doctor', 'MYLAB', '16/01/2026', 'production', true),
      c('MYLS700602', 'CAROL HUNT', 'PID102', 'Analog Case', 'TEST JAMES', 'MYLAB', '17/01/2026', 'production'),
      c('MYLS700603', 'DAVID PRICE', 'PID103', 'IOS Case', 'Bedford Demo Doctor', 'MYLAB', '16/01/2026', 'production', true),
      c('MYLS700602', 'CAROL HUNT', 'PID102', 'Analog Case', 'TEST JAMES', 'MYLAB', '17/01/2026', 'production'),
      c('MYLS700603', 'DAVID PRICE', 'PID103', 'IOS Case', 'Bedford Demo Doctor', 'MYLAB', '16/01/2026', 'production', true),
      c('MYLS700602', 'CAROL HUNT', 'PID102', 'Analog Case', 'TEST JAMES', 'MYLAB', '17/01/2026', 'production'),
      c('MYLS700603', 'DAVID PRICE', 'PID103', 'IOS Case', 'Bedford Demo Doctor', 'MYLAB', '16/01/2026', 'production', true),
      c('MYLS700602', 'CAROL HUNT', 'PID102', 'Analog Case', 'TEST JAMES', 'MYLAB', '17/01/2026', 'production'),
      c('MYLS700603', 'DAVID PRICE', 'PID103', 'IOS Case', 'Bedford Demo Doctor', 'MYLAB', '16/01/2026', 'production', true),
    ],
    submitted: [
      c('P700840', 'Jen Millward', 'j milward', 'IOS Case', 'MLC LAB', 'MLC LAB', '24/02/2026', 'submitted'),
      c('P700843', 'Mlc Test Lizzie', 'Elizabeth Cousins', 'IOS Case', 'MLC LAB', 'MLC LAB', '23/02/2026', 'submitted'),
      c('MLCLS700831', 'GLENN MARVEL', 'PID894', 'Analog Case', 'Bedford Demo Doctor', 'MLC LAB', '20/02/2026', 'submitted'),
      c('P700840', 'Jen Millward', 'j milward', 'IOS Case', 'MLC LAB', 'MLC LAB', '24/02/2026', 'submitted'),
      c('P700843', 'Mlc Test Lizzie', 'Elizabeth Cousins', 'IOS Case', 'MLC LAB', 'MLC LAB', '23/02/2026', 'submitted'),
      c('MLCLS700831', 'GLENN MARVEL', 'PID894', 'Analog Case', 'Bedford Demo Doctor', 'MLC LAB', '20/02/2026', 'submitted'),
      c('P700840', 'Jen Millward', 'j milward', 'IOS Case', 'MLC LAB', 'MLC LAB', '24/02/2026', 'submitted'),
      c('P700843', 'Mlc Test Lizzie', 'Elizabeth Cousins', 'IOS Case', 'MLC LAB', 'MLC LAB', '23/02/2026', 'submitted'),
      c('MLCLS700831', 'GLENN MARVEL', 'PID894', 'Analog Case', 'Bedford Demo Doctor', 'MLC LAB', '20/02/2026', 'submitted'),
      c('P700840', 'Jen Millward', 'j milward', 'IOS Case', 'MLC LAB', 'MLC LAB', '24/02/2026', 'submitted'),
      c('P700843', 'Mlc Test Lizzie', 'Elizabeth Cousins', 'IOS Case', 'MLC LAB', 'MLC LAB', '23/02/2026', 'submitted'),
      c('MLCLS700831', 'GLENN MARVEL', 'PID894', 'Analog Case', 'Bedford Demo Doctor', 'MLC LAB', '20/02/2026', 'submitted'),
      c('P700840', 'Jen Millward', 'j milward', 'IOS Case', 'MLC LAB', 'MLC LAB', '24/02/2026', 'submitted'),
      c('P700843', 'Mlc Test Lizzie', 'Elizabeth Cousins', 'IOS Case', 'MLC LAB', 'MLC LAB', '23/02/2026', 'submitted'),
      c('MLCLS700831', 'GLENN MARVEL', 'PID894', 'Analog Case', 'Bedford Demo Doctor', 'MLC LAB', '20/02/2026', 'submitted'),
    ],
    recent: [
      c('MYLS700700', 'ETHAN CLARK', 'PID201', 'Analog Case', 'Bedford Demo Doctor', 'MYLAB', '25/02/2026', 'recent'),
      c('MYLS700701', 'SOPHIE TURNER', 'PID202', 'IOS Case', 'TEST JAMES', 'MYLAB', '24/02/2026', 'recent'),
      c('MYLS700700', 'ETHAN CLARK', 'PID201', 'Analog Case', 'Bedford Demo Doctor', 'MYLAB', '25/02/2026', 'recent'),
      c('MYLS700701', 'SOPHIE TURNER', 'PID202', 'IOS Case', 'TEST JAMES', 'MYLAB', '24/02/2026', 'recent'),
      c('MYLS700700', 'ETHAN CLARK', 'PID201', 'Analog Case', 'Bedford Demo Doctor', 'MYLAB', '25/02/2026', 'recent'),
      c('MYLS700701', 'SOPHIE TURNER', 'PID202', 'IOS Case', 'TEST JAMES', 'MYLAB', '24/02/2026', 'recent'),
    ],
  },
};

// ─────────────────────────────────────────────────────────────
// PRACTICE dummy data
// ─────────────────────────────────────────────────────────────
const PRACTICE_DATA: DashboardPageData = {
  role: 'practice',
  tabCounts: { rejected: 1, hold: 4, transit: 2, production: 22, submitted: 15, recent: 5 },
  cases: {
    rejected: [
      c('PRC700100', 'HELEN FORD', 'PID300', 'IOS QC', 'Practice Doctor A', 'MYLAB', '10/01/2026', 'rejected'),
    ],
    hold: [
      c('PRC700200', 'MARK BAILEY', 'PID301', 'Analog Case', 'Practice Doctor A', 'MYLAB', '29/12/2025', 'hold'),
      c('PRC700201', 'CLAIRE WOODS', 'PID302', 'Analog Case', 'Practice Doctor B', 'MYLAB', '27/12/2025', 'hold'),
      c('PRC700202', 'TOM BAKER', 'PID303', 'IOS Case', 'Practice Doctor A', 'MYLAB', '26/12/2025', 'hold', true),
      c('PRC700203', 'LINDA PARKER', 'PID304', 'Analog Case', 'Practice Doctor B', 'MYLAB', '25/12/2025', 'hold'),
    ],
    transit: [
      c('PRC700300', 'GARY SCOTT', 'PID305', 'Analog Case', 'Practice Doctor A', 'MYLAB', '20/02/2026', 'transit'),
      c('PRC700301', 'NINA GREEN', 'PID306', 'IOS Case', 'Practice Doctor B', 'MYLAB', '19/02/2026', 'transit', true),
    ],
    production: [
      c('PRC700400', 'OLIVER JAMES', 'PID307', 'Analog Case', 'Practice Doctor A', 'MYLAB', '18/02/2026', 'production'),
      c('PRC700401', 'RACHEL MOORE', 'PID308', 'IOS Case', 'Practice Doctor B', 'MYLAB', '17/02/2026', 'production', true),
      c('PRC700402', 'SAMUEL LEE', 'PID309', 'Analog Case', 'Practice Doctor A', 'MYLAB', '16/02/2026', 'production'),
    ],
    submitted: [
      c('PRC700500', 'TINA HARRIS', 'PID310', 'Analog Case', 'Practice Doctor A', 'MYLAB', '24/02/2026', 'submitted'),
      c('PRC700501', 'VICTOR KING', 'PID311', 'IOS Case', 'Practice Doctor B', 'MYLAB', '23/02/2026', 'submitted', true),
      c('PRC700502', 'WENDY WRIGHT', 'PID312', 'Analog Case', 'Practice Doctor A', 'MYLAB', '22/02/2026', 'submitted'),
    ],
    recent: [
      c('PRC700600', 'XENA JOHNSON', 'PID313', 'IOS Case', 'Practice Doctor B', 'MYLAB', '25/02/2026', 'recent'),
      c('PRC700601', 'YAN ROBERTS', 'PID314', 'Analog Case', 'Practice Doctor A', 'MYLAB', '24/02/2026', 'recent'),
    ],
  },
};

// ─────────────────────────────────────────────────────────────
// DSO dummy data
// ─────────────────────────────────────────────────────────────
const DSO_DATA: DashboardPageData = {
  role: 'dso',
  tabCounts: { rejected: 3, hold: 12, transit: 5, production: 88, submitted: 42, recent: 10 },
  cases: {
    rejected: [
      c('DSO700001', 'ALEX STONE', 'PID400', 'IOS QC', 'DSO Doctor A', 'Lab Network A', '08/01/2026', 'rejected'),
      c('DSO700002', 'BELLA ROSS', 'PID401', 'IOS Case', 'DSO Doctor B', 'Lab Network A', '07/01/2026', 'rejected'),
      c('DSO700003', 'CHRIS FORD', 'PID402', 'Analog Case', 'DSO Doctor C', 'Lab Network B', '06/01/2026', 'rejected'),
    ],
    hold: [
      c('DSO700100', 'DIANA HAYES', 'PID403', 'Analog Case', 'DSO Doctor A', 'Lab Network A', '29/12/2025', 'hold'),
      c('DSO700101', 'EVAN MILLS', 'PID404', 'IOS Case', 'DSO Doctor B', 'Lab Network B', '28/12/2025', 'hold'),
      c('DSO700102', 'FAYE GRANT', 'PID405', 'Analog Case', 'DSO Doctor C', 'Lab Network A', '27/12/2025', 'hold'),
      c('DSO700103', 'GLEN SHAW', 'PID406', 'IOS QC', 'DSO Doctor A', 'Lab Network B', '26/12/2025', 'hold'),
    ],
    transit: [
      c('DSO700200', 'HOLLY WARD', 'PID407', 'Analog Case', 'DSO Doctor B', 'Lab Network A', '20/02/2026', 'transit'),
      c('DSO700201', 'IAN KNIGHT', 'PID408', 'IOS Case', 'DSO Doctor C', 'Lab Network B', '19/02/2026', 'transit'),
    ],
    production: [
      c('DSO700300', 'JADE PORTER', 'PID409', 'Analog Case', 'DSO Doctor A', 'Lab Network A', '18/02/2026', 'production'),
      c('DSO700301', 'KIM HUNT', 'PID410', 'IOS Case', 'DSO Doctor B', 'Lab Network B', '17/02/2026', 'production'),
      c('DSO700302', 'LEO WEST', 'PID411', 'Analog Case', 'DSO Doctor C', 'Lab Network A', '16/02/2026', 'production'),
    ],
    submitted: [
      c('DSO700400', 'MIA NORTH', 'PID412', 'Analog Case', 'DSO Doctor A', 'Lab Network B', '24/02/2026', 'submitted'),
      c('DSO700401', 'NOAH SOUTH', 'PID413', 'IOS Case', 'DSO Doctor B', 'Lab Network A', '23/02/2026', 'submitted'),
    ],
    recent: [
      c('DSO700500', 'ORA EAST', 'PID414', 'Analog Case', 'DSO Doctor C', 'Lab Network B', '25/02/2026', 'recent'),
      c('DSO700501', 'PAUL WEST', 'PID415', 'IOS Case', 'DSO Doctor A', 'Lab Network A', '24/02/2026', 'recent'),
    ],
  },
};

// ─────────────────────────────────────────────────────────────
// LAB dummy data
// ─────────────────────────────────────────────────────────────
const LAB_DATA: DashboardPageData = {
  role: 'lab',
  tabCounts: { rejected: 0, hold: 10, transit: 3, production: 48, submitted: 77, recent: 2 },
  cases: {
    rejected: [],
    hold: [
      c('MYLS700588', 'WILL BIL', 'poiuyt', 'Analog', 'MYLAB', 'MYLAB', '29/12/2025', 'hold'),
      c('MYLS700578', 'SHIRLEY WILL', 'pid78345', 'Analog', 'MYLAB', 'MYLAB', '27/12/2025', 'hold'),
      c('MYLS700568', 'GILL WILL', 'poiuy', 'Analog', 'MYLAB', 'MYLAB', '26/12/2025', 'hold'),
      c('MYLS700666', 'FIONA CHURCH', 'pid089', 'Analog', 'MYLAB', 'MYLAB', '21/01/2026', 'hold'),
      c('MYLS700642', 'MARY BRANDO', 'PID578998', 'Analog', 'MYLAB', 'MYLAB', '08/01/2026', 'hold'),
      c('MYLS700622', 'VIVIAN RICHARD', 'pid7854', 'Analog', 'MYLAB', 'MYLAB', '04/01/2026', 'hold'),
      c('DILS700072', 'GRIFFEN CHARLES', '45678', 'Analog', 'Dental Infinity Lab', 'Dental Infinity Lab', '02/12/2025', 'hold'),
      c('DILS700052', 'ALLEY GILLIAN', 'pid457', 'Analog', 'Dental Infinity Lab', 'Dental Infinity Lab', '02/12/2025', 'hold'),
      c('DILS700048', 'SHARON WILSON', 'PID5674', 'Analog', 'Dental Infinity Lab', 'Dental Infinity Lab', '02/12/2025', 'hold'),
      c('DILS700042', 'SIMON VINCENT', 'PID3456', 'Analog', 'Dental Infinity Lab', 'Dental Infinity Lab', '02/12/2025', 'hold'),
    ],
    transit: [
      c('LAB700300', 'PETER LYNCH', 'PID500', 'Analog', 'MYLAB', 'MYLAB', '20/02/2026', 'transit'),
      c('LAB700301', 'QUINN BELL', 'PID501', 'Analog', 'MYLAB', 'MYLAB', '19/02/2026', 'transit'),
      c('LAB700302', 'ROSA COOK', 'PID502', 'Analog', 'Dental Infinity Lab', 'Dental Infinity Lab', '18/02/2026', 'transit'),
    ],
    production: [
      c('LAB700400', 'SAM WOOD', 'PID503', 'Analog', 'MYLAB', 'MYLAB', '18/02/2026', 'production'),
      c('LAB700401', 'TARA HILL', 'PID504', 'IOS Case', 'MYLAB', 'MYLAB', '17/02/2026', 'production'),
      c('LAB700402', 'UMA LANE', 'PID505', 'Analog', 'Dental Infinity Lab', 'Dental Infinity Lab', '16/02/2026', 'production'),
    ],
    submitted: [
      c('MLCLS700831', 'GLENN MARVEL', 'PID894', 'Analog Case', 'MLC LAB', 'MLC LAB', '20/02/2026', 'submitted'),
      c('MLCLS700830', 'WILLIAM EDWARD', 'pid896', 'Analog Case', 'MLC LAB', 'MLC LAB', '19/02/2026', 'submitted'),
      c('P700812', 'C C', '1000586', 'IOS Case', 'MLC LAB', 'MLC LAB', '19/02/2026', 'submitted', true),
      c('P700767', 'Alex 2', undefined, 'IOS QC', 'MLC LAB', 'MLC LAB', '16/02/2026', 'submitted', true),
      c('DILS700590', 'NEIL DAVIS', 'pid45225', 'Analog Case', 'Dental Infinity Lab', 'Dental Infinity Lab', '29/12/2025', 'submitted'),
    ],
    recent: [
      c('LAB700600', 'VERA FOX', 'PID506', 'Analog', 'MYLAB', 'MYLAB', '25/02/2026', 'recent'),
      c('LAB700601', 'WAYNE PRICE', 'PID507', 'IOS Case', 'Dental Infinity Lab', 'Dental Infinity Lab', '24/02/2026', 'recent'),
    ],
  },
};

// ─────────────────────────────────────────────────────────────
// ADMIN dummy data
// ─────────────────────────────────────────────────────────────
const ADMIN_DATA: DashboardPageData = {
  role: 'admin',
  tabCounts: { rejected: 8, hold: 34, transit: 12, production: 156, submitted: 210, recent: 22 },
  cases: {
    rejected: [
      c('ADM700001', 'JAMES SMITH', 'PID600', 'IOS QC', 'Doctor A', 'Lab A', '10/01/2026', 'rejected'),
      c('ADM700002', 'KATE JONES', 'PID601', 'IOS Case', 'Doctor B', 'Lab B', '09/01/2026', 'rejected'),
      c('ADM700003', 'LIAM BROWN', 'PID602', 'Analog Case', 'Doctor C', 'Lab A', '08/01/2026', 'rejected'),
    ],
    hold: [
      c('ADM700100', 'MILA DAVIS', 'PID603', 'Analog Case', 'Doctor A', 'Lab A', '29/12/2025', 'hold'),
      c('ADM700101', 'NATE WILSON', 'PID604', 'IOS Case', 'Doctor B', 'Lab B', '28/12/2025', 'hold'),
      c('ADM700102', 'OLIVIA MOORE', 'PID605', 'Analog Case', 'Doctor C', 'Lab A', '27/12/2025', 'hold'),
      c('ADM700103', 'PAT TAYLOR', 'PID606', 'IOS QC', 'Doctor A', 'Lab C', '26/12/2025', 'hold'),
      c('ADM700104', 'QUINN HARRIS', 'PID607', 'Analog Case', 'Doctor B', 'Lab B', '25/12/2025', 'hold'),
    ],
    transit: [
      c('ADM700200', 'RILEY CLARK', 'PID608', 'Analog Case', 'Doctor A', 'Lab A', '20/02/2026', 'transit'),
      c('ADM700201', 'SARA LEWIS', 'PID609', 'IOS Case', 'Doctor C', 'Lab C', '19/02/2026', 'transit'),
    ],
    production: [
      c('ADM700300', 'TOM LEE', 'PID610', 'Analog Case', 'Doctor A', 'Lab A', '18/02/2026', 'production'),
      c('ADM700301', 'UNA WALKER', 'PID611', 'IOS Case', 'Doctor B', 'Lab B', '17/02/2026', 'production'),
      c('ADM700302', 'VINCE HALL', 'PID612', 'Analog Case', 'Doctor C', 'Lab C', '16/02/2026', 'production'),
      c('ADM700303', 'WILLA YOUNG', 'PID613', 'IOS QC', 'Doctor A', 'Lab A', '15/02/2026', 'production', true),
    ],
    submitted: [
      c('ADM700400', 'XARA KING', 'PID614', 'Analog Case', 'Doctor B', 'Lab B', '24/02/2026', 'submitted'),
      c('ADM700401', 'YARA SCOTT', 'PID615', 'IOS Case', 'Doctor C', 'Lab C', '23/02/2026', 'submitted'),
      c('ADM700402', 'ZARA GREEN', 'PID616', 'Analog Case', 'Doctor A', 'Lab A', '22/02/2026', 'submitted'),
    ],
    recent: [
      c('ADM700500', 'ALEX BAKER', 'PID617', 'IOS Case', 'Doctor B', 'Lab B', '25/02/2026', 'recent'),
      c('ADM700501', 'BRIA ADAMS', 'PID618', 'Analog Case', 'Doctor C', 'Lab C', '24/02/2026', 'recent'),
    ],
  },
};

// ─────────────────────────────────────────────────────────────
// INTEGRATOR dummy data
// ─────────────────────────────────────────────────────────────
const INTEGRATOR_DATA: DashboardPageData = {
  role: 'integrator',
  tabCounts: { rejected: 0, hold: 5, transit: 1, production: 30, submitted: 60, recent: 8 },
  cases: {
    rejected: [],
    hold: [
      c('INT700100', 'CARMEN DIAZ', 'PID700', 'IOS Case', 'Int Doctor A', 'Int Lab', '29/12/2025', 'hold'),
      c('INT700101', 'DEREK NGUYEN', 'PID701', 'Analog Case', 'Int Doctor B', 'Int Lab', '27/12/2025', 'hold'),
      c('INT700102', 'ELENA RUSSO', 'PID702', 'IOS QC', 'Int Doctor A', 'Int Lab', '26/12/2025', 'hold'),
    ],
    transit: [
      c('INT700200', 'FELIX MOREAU', 'PID703', 'Analog Case', 'Int Doctor B', 'Int Lab', '20/02/2026', 'transit'),
    ],
    production: [
      c('INT700300', 'GRACE PATEL', 'PID704', 'IOS Case', 'Int Doctor A', 'Int Lab', '18/02/2026', 'production'),
      c('INT700301', 'HENRY CHEN', 'PID705', 'Analog Case', 'Int Doctor B', 'Int Lab', '17/02/2026', 'production'),
    ],
    submitted: [
      c('INT700400', 'ISLA KIM', 'PID706', 'IOS Case', 'Int Doctor A', 'Int Lab', '24/02/2026', 'submitted'),
      c('INT700401', 'JAKE ALI', 'PID707', 'Analog Case', 'Int Doctor B', 'Int Lab', '23/02/2026', 'submitted'),
      c('INT700402', 'KARA SINGH', 'PID708', 'IOS QC', 'Int Doctor A', 'Int Lab', '22/02/2026', 'submitted'),
    ],
    recent: [
      c('INT700500', 'LENA OTTO', 'PID709', 'Analog Case', 'Int Doctor B', 'Int Lab', '25/02/2026', 'recent'),
      c('INT700501', 'MASON WOLF', 'PID710', 'IOS Case', 'Int Doctor A', 'Int Lab', '24/02/2026', 'recent'),
    ],
  },
};

// ─────────────────────────────────────────────────────────────
// Map of all dummy data by role
// ─────────────────────────────────────────────────────────────
const DUMMY_DATA: Record<LoginRole, DashboardPageData> = {
  doctor: DOCTOR_DATA,
  practice: PRACTICE_DATA,
  dso: DSO_DATA,
  lab: LAB_DATA,
  admin: ADMIN_DATA,
  integrator: INTEGRATOR_DATA,
};

// ─────────────────────────────────────────────────────────────
// Simulated async API call — replace with real fetch()
// ─────────────────────────────────────────────────────────────
export async function fetchDashboardData(role: LoginRole): Promise<DashboardPageData> {
  // Simulate network latency
  await new Promise((r) => setTimeout(r, 400));
  return DUMMY_DATA[role];
}