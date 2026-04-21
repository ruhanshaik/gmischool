import type { Student, Teacher, ClassRoom, AttendanceRecord, Exam, ExamResult, FeeRecord, Notice, CalendarEvent, Notification } from './types';

// Classes: Baby, 1st to 10th, 1st PU, 2nd PU
export const initialClasses: ClassRoom[] = [
  { id: "c-baby", name: "Baby Class", section: "A", teacherId: "t1", studentIds: ["s1","s2","s3","s4","s5","s6","s7","s8","s9","s10"], capacity: 30 },
  { id: "c-1st", name: "1st Std", section: "A", teacherId: "t2", studentIds: ["s11","s12","s13","s14","s15","s16","s17","s18","s19","s20"], capacity: 40 },
  { id: "c-2nd", name: "2nd Std", section: "A", teacherId: "t3", studentIds: ["s21","s22","s23","s24","s25","s26","s27","s28","s29","s30"], capacity: 40 },
  { id: "c-3rd", name: "3rd Std", section: "A", teacherId: "t4", studentIds: ["s31","s32","s33","s34","s35","s36","s37","s38","s39","s40"], capacity: 40 },
  { id: "c-4th", name: "4th Std", section: "A", teacherId: "t5", studentIds: ["s41","s42","s43","s44","s45","s46","s47","s48","s49","s50"], capacity: 40 },
  { id: "c-5th", name: "5th Std", section: "A", teacherId: "t6", studentIds: ["s51","s52","s53","s54","s55","s56","s57","s58","s59","s60"], capacity: 40 },
  { id: "c-6th", name: "6th Std", section: "A", teacherId: "t7", studentIds: ["s61","s62","s63","s64","s65","s66","s67","s68","s69","s70"], capacity: 40 },
  { id: "c-7th", name: "7th Std", section: "A", teacherId: "t8", studentIds: ["s71","s72","s73","s74","s75","s76","s77","s78","s79","s80"], capacity: 40 },
  { id: "c-8th", name: "8th Std", section: "A", teacherId: "t9", studentIds: ["s81","s82","s83","s84","s85","s86","s87","s88","s89","s90"], capacity: 40 },
  { id: "c-9th", name: "9th Std", section: "A", teacherId: "t10", studentIds: ["s91","s92","s93","s94","s95","s96","s97","s98","s99","s100"], capacity: 40 },
  { id: "c-10th", name: "10th Std", section: "A", teacherId: "t1", studentIds: ["s101","s102","s103","s104","s105","s106","s107","s108","s109","s110"], capacity: 40 },
  { id: "c-1pu", name: "1st PU", section: "A", teacherId: "t2", studentIds: ["s111","s112","s113","s114","s115","s116","s117","s118","s119","s120"], capacity: 50 },
  { id: "c-2pu", name: "2nd PU", section: "A", teacherId: "t3", studentIds: ["s121","s122","s123","s124","s125","s126","s127","s128","s129","s130"], capacity: 50 },
];

function classCode(classId: string): string {
  const map: Record<string, string> = {
    "c-baby": "BABY", "c-1st": "1ST", "c-2nd": "2ND", "c-3rd": "3RD", "c-4th": "4TH",
    "c-5th": "5TH", "c-6th": "6TH", "c-7th": "7TH", "c-8th": "8TH", "c-9th": "9TH",
    "c-10th": "10TH", "c-1pu": "1PU", "c-2pu": "2PU",
  };
  return map[classId] || "UNK";
}

function className(classId: string): string {
  const c = initialClasses.find(x => x.id === classId);
  return c ? `${c.name} - ${c.section}` : "";
}

function genStudentNumber(classId: string, name: string, seq: number): string {
  const cc = classCode(classId);
  const nameCode = name.replace(/\s/g, "").substring(0, 3).toUpperCase();
  return `${cc}${nameCode}${String(seq).padStart(3, "0")}`;
}

const studentNames = [
  "Aarav Sharma","Priya Mehta","Rohan Patel","Ananya Reddy","Karthik Nair",
  "Meera Iyer","Vikram Singh","Sanya Gupta","Arjun Das","Divya Joshi",
  "Nikhil Banerjee","Ishita Kapoor","Ruhan Ahmed","Tanya Verma","Aditya Kumar",
  "Sneha Rao","Manish Tiwari","Pooja Desai","Rahul Mishra","Kavya Pillai",
  "Abhi Saxena","Ritika Choudhary","Suresh Menon","Deepa Nambiar","Farhan Khan",
  "Sakshi Pandey","Yash Malhotra","Nisha Shetty","Omkar Patil","Simran Kaur",
  "Harsh Agarwal","Lakshmi Venkat","Tarun Jain","Bhavna Dubey","Gaurav Sinha",
  "Pallavi Ghosh","Rajat Bhatia","Swati Kulkarni","Mohit Chauhan","Anjali Thakur",
  "Vikas Yadav","Shruti Hegde","Pankaj Rastogi","Rekha Nayak","Chirag Bhatt",
  "Nandini Prasad","Sameer Qureshi","Uma Shankar","Vishal Goel","Amrita Sen",
  "Dev Rathore","Jaya Madhavan","Kunal Oberoi","Lavanya Suresh","Mohan Shukla",
  "Neha Dhawan","Pranav Khanna","Roshni Dutta","Siddharth Jha","Tanvi Sethi",
  "Akash Luthra","Bhargavi Iyengar","Chetan Mane","Dhanya Menon","Esha Tripathi",
  "Girish Kamath","Hema Narayan","Irfan Sheikh","Jayashree Raman","Kiran Bose",
  "Lohit Hegde","Meghana Rao","Nakul Arora","Oviya Krishnan","Parth Tandan",
  "Qasim Mirza","Ramya Gowda","Sahil Bedi","Tejas Kale","Usha Srinivasan",
  "Varun Naidu","Wahida Begum","Xavier DSouza","Yamini Chandra","Zaid Hussain",
  "Aman Bhardwaj","Brinda Mohan","Chandni Raut","Disha Srivastava","Ekta Singhania",
  "Faisal Rahman","Garima Puri","Hemant Rawat","Isha Bhattacharya","Jasleen Monga",
  "Kartik Deshpande","Lata Sundaram","Manoj Pai","Naina Lamba","Ojas Dalvi",
  "Preeti Kundra","Raghav Mehra","Sunita Pal","Tushar Wagh","Urmi Phadke",
  "Vinay Kulkami","Warda Hakim","Yuvraj Solanki","Zara Syed","Arun Mistry",
  "Bindu Chakraborty","Cyrus Irani","Dimple Mahajan","Elina Barua","Firoz Pathan",
];

const classIds = initialClasses.map(c => c.id);

export const initialStudents: Student[] = [];
let sIdx = 1;
for (const cId of classIds) {
  for (let i = 0; i < 10; i++) {
    const nameIdx = (classIds.indexOf(cId) * 10 + i) % studentNames.length;
    const name = studentNames[nameIdx];
    const sn = genStudentNumber(cId, name, i + 1);
    initialStudents.push({
      id: `s${sIdx}`,
      name,
      email: `${name.split(" ")[0].toLowerCase()}${sIdx}@stjudes.edu`,
      phone: `98765${String(sIdx).padStart(5, "0")}`,
      classId: cId,
      className: className(cId),
      rollNumber: sn,
      gender: i % 2 === 0 ? "Male" : "Female",
      dateOfBirth: `${2010 + Math.floor(Math.random() * 8)}-${String(1 + (i % 12)).padStart(2, "0")}-${String(5 + i).padStart(2, "0")}`,
      address: `${10 + i} Park Street, Mumbai`,
      parentName: `Mr. ${name.split(" ")[1] || "Kumar"}`,
      parentPhone: `98760${String(sIdx).padStart(5, "0")}`,
      admissionDate: "2024-04-01",
      fees: 25000 + (classIds.indexOf(cId) * 2000),
    });
    sIdx++;
  }
}

export const initialTeachers: Teacher[] = [
  { id: "t1", name: "Mr. Harrison", email: "harrison@stjudes.edu", phone: "9800000001", subject: "Mathematics", classIds: ["c-baby", "c-10th"], qualification: "M.Sc Mathematics", joinDate: "2018-06-15", salary: 65000 },
  { id: "t2", name: "Mrs. Fernandez", email: "fernandez@stjudes.edu", phone: "9800000002", subject: "English", classIds: ["c-1st", "c-1pu"], qualification: "M.A English Literature", joinDate: "2019-07-01", salary: 60000 },
  { id: "t3", name: "Mr. Krishnan", email: "krishnan@stjudes.edu", phone: "9800000003", subject: "Science", classIds: ["c-2nd", "c-2pu"], qualification: "M.Sc Physics", joinDate: "2020-04-10", salary: 62000 },
  { id: "t4", name: "Mrs. Deshpande", email: "deshpande@stjudes.edu", phone: "9800000004", subject: "History", classIds: ["c-3rd", "c-4th"], qualification: "M.A History", joinDate: "2017-08-20", salary: 58000 },
  { id: "t5", name: "Mr. Abraham", email: "abraham@stjudes.edu", phone: "9800000005", subject: "Computer Science", classIds: ["c-4th", "c-5th"], qualification: "M.Tech CS", joinDate: "2021-01-05", salary: 70000 },
  { id: "t6", name: "Mrs. Sunitha", email: "sunitha@stjudes.edu", phone: "9800000006", subject: "Kannada", classIds: ["c-5th", "c-6th"], qualification: "M.A Kannada", joinDate: "2019-03-15", salary: 55000 },
  { id: "t7", name: "Mr. Joseph", email: "joseph@stjudes.edu", phone: "9800000007", subject: "Social Studies", classIds: ["c-6th", "c-7th"], qualification: "M.A Sociology", joinDate: "2020-06-20", salary: 57000 },
  { id: "t8", name: "Mrs. Lakshmi", email: "lakshmi@stjudes.edu", phone: "9800000008", subject: "Hindi", classIds: ["c-7th", "c-8th"], qualification: "M.A Hindi", joinDate: "2018-09-10", salary: 54000 },
  { id: "t9", name: "Mr. Rajan", email: "rajan@stjudes.edu", phone: "9800000009", subject: "Physics", classIds: ["c-8th", "c-9th"], qualification: "M.Sc Physics", joinDate: "2017-12-01", salary: 63000 },
  { id: "t10", name: "Mrs. Preethi", email: "preethi@stjudes.edu", phone: "9800000010", subject: "Chemistry", classIds: ["c-9th", "c-10th"], qualification: "M.Sc Chemistry", joinDate: "2021-04-15", salary: 61000 },
  { id: "t11", name: "Mr. Naveen", email: "naveen@stjudes.edu", phone: "9800000011", subject: "Biology", classIds: ["c-1pu", "c-2pu"], qualification: "M.Sc Biology", joinDate: "2022-01-10", salary: 59000 },
  { id: "t12", name: "Mrs. Anjali", email: "anjali@stjudes.edu", phone: "9800000012", subject: "Physical Education", classIds: ["c-baby", "c-1st", "c-2nd"], qualification: "B.P.Ed", joinDate: "2020-07-01", salary: 48000 },
];

// Attendance for today and a few past days for first few classes
const dates = ["2026-04-21", "2026-04-20", "2026-04-19", "2026-04-18", "2026-04-17", "2026-04-16", "2026-04-15"];
const statuses: ("Present" | "Absent" | "Late")[] = ["Present", "Present", "Present", "Present", "Present", "Absent", "Late", "Present", "Present", "Present"] as any;
export const initialAttendance: AttendanceRecord[] = [];
let aIdx = 1;
for (const cId of classIds.slice(0, 5)) {
  const cStudents = initialStudents.filter(s => s.classId === cId);
  for (const date of dates.slice(0, 3)) {
    for (let i = 0; i < cStudents.length; i++) {
      initialAttendance.push({
        id: `a${aIdx++}`,
        studentId: cStudents[i].id,
        classId: cId,
        date,
        status: statuses[i % statuses.length],
      });
    }
  }
}

export const initialExams: Exam[] = [
  { id: "e1", name: "Mid-Term Examination", classId: "c-10th", subject: "Mathematics", date: "2026-03-15", totalMarks: 100 },
  { id: "e2", name: "Mid-Term Examination", classId: "c-10th", subject: "English", date: "2026-03-16", totalMarks: 100 },
  { id: "e3", name: "Mid-Term Examination", classId: "c-9th", subject: "Science", date: "2026-03-17", totalMarks: 100 },
  { id: "e4", name: "Unit Test 1", classId: "c-8th", subject: "Mathematics", date: "2026-02-20", totalMarks: 50 },
  { id: "e5", name: "Unit Test 1", classId: "c-7th", subject: "Hindi", date: "2026-02-21", totalMarks: 50 },
  { id: "e6", name: "Quarterly Exam", classId: "c-1pu", subject: "Physics", date: "2026-01-15", totalMarks: 100 },
  { id: "e7", name: "Quarterly Exam", classId: "c-2pu", subject: "Chemistry", date: "2026-01-16", totalMarks: 100 },
  { id: "e8", name: "Mid-Term Examination", classId: "c-5th", subject: "Kannada", date: "2026-03-18", totalMarks: 100 },
  { id: "e9", name: "Unit Test 2", classId: "c-3rd", subject: "English", date: "2026-04-10", totalMarks: 50 },
  { id: "e10", name: "Unit Test 1", classId: "c-baby", subject: "General", date: "2026-02-15", totalMarks: 50 },
];

export const initialResults: ExamResult[] = [];
let rIdx = 1;
for (const exam of initialExams) {
  const cStudents = initialStudents.filter(s => s.classId === exam.classId);
  for (const s of cStudents) {
    initialResults.push({
      id: `r${rIdx++}`,
      examId: exam.id,
      studentId: s.id,
      marksObtained: Math.floor(Math.random() * (exam.totalMarks * 0.5)) + Math.floor(exam.totalMarks * 0.4),
    });
  }
}

// Fees: each student has their class fee assigned
export const initialFees: FeeRecord[] = [];
let fIdx = 1;
for (const s of initialStudents.slice(0, 40)) {
  const paid = fIdx % 3 !== 0;
  initialFees.push({
    id: `f${fIdx}`,
    studentId: s.id,
    amount: s.fees,
    dueDate: "2026-04-01",
    paidDate: paid ? "2026-03-28" : null,
    status: paid ? "Paid" : (fIdx % 5 === 0 ? "Overdue" : "Pending"),
    description: "Term 1 Tuition Fee",
    paidAmount: paid ? s.fees : (fIdx % 4 === 0 ? Math.floor(s.fees / 2) : 0),
  });
  fIdx++;
}

export const initialNotices: Notice[] = [
  { id: "n1", title: "Annual Sports Day", content: "The Annual Sports Day will be held on May 15th, 2026. All students are expected to participate in at least one event. Registration forms are available at the sports office.", date: "2026-04-18", author: "Principal", priority: "High" },
  { id: "n2", title: "Parent-Teacher Meeting", content: "Parent-Teacher Meeting for Grade 10 is scheduled for April 28th, 2026 from 10:00 AM to 1:00 PM. Please ensure your ward's report card is collected.", date: "2026-04-15", author: "Vice Principal", priority: "Medium" },
  { id: "n3", title: "Science Exhibition", content: "The inter-school Science Exhibition will be held on May 5th. Interested students should submit their project proposals to their science teachers by April 25th.", date: "2026-04-12", author: "Mr. Krishnan", priority: "Medium" },
  { id: "n4", title: "Fee Payment Reminder", content: "This is a reminder that Term 1 fees are due by April 30th. Late payment will incur a penalty of 2% per month. Please clear all dues at the earliest.", date: "2026-04-10", author: "Accounts Department", priority: "High" },
  { id: "n5", title: "Library Book Return", content: "All borrowed library books must be returned by April 22nd for the annual audit. Students with overdue books will not be issued new library cards.", date: "2026-04-08", author: "Librarian", priority: "Low" },
  { id: "n6", title: "Independence Day Celebration", content: "Independence Day will be celebrated on August 15th. Flag hoisting at 8:00 AM. All staff and students must attend in formal uniform.", date: "2026-04-05", author: "Principal", priority: "High" },
  { id: "n7", title: "New Computer Lab", content: "The new computer lab on the 2nd floor is now operational. Students can book lab time through their class teachers.", date: "2026-04-02", author: "Mr. Abraham", priority: "Medium" },
  { id: "n8", title: "Art Competition", content: "Inter-class art competition on the theme 'My India' will be held on April 30th. Open to all classes from 5th to 10th.", date: "2026-03-28", author: "Mrs. Deshpande", priority: "Low" },
  { id: "n9", title: "Vaccination Drive", content: "A vaccination drive will be conducted on May 2nd. Parents must sign the consent form sent via email by April 28th.", date: "2026-03-25", author: "School Nurse", priority: "High" },
  { id: "n10", title: "Bus Route Change", content: "Route 5 and Route 8 will have modified timings starting May 1st. Updated schedules have been shared via parent WhatsApp groups.", date: "2026-03-20", author: "Transport Coordinator", priority: "Medium" },
];

export const initialCalendarEvents: CalendarEvent[] = [
  { id: "ev1", title: "Republic Day", date: "2026-01-26", type: "Holiday", description: "National Holiday" },
  { id: "ev2", title: "Mid-Term Exams Begin", date: "2026-03-15", type: "Exam", description: "Mid-term examinations for all grades" },
  { id: "ev3", title: "Mid-Term Exams End", date: "2026-03-22", type: "Exam", description: "Last day of mid-term examinations" },
  { id: "ev4", title: "Parent-Teacher Meeting", date: "2026-04-28", type: "Meeting", description: "PTM for Grade 10 students" },
  { id: "ev5", title: "Science Exhibition", date: "2026-05-05", type: "Event", description: "Inter-school Science Exhibition" },
  { id: "ev6", title: "Annual Sports Day", date: "2026-05-15", type: "Event", description: "Annual Sports Day celebrations" },
  { id: "ev7", title: "Summer Break Begins", date: "2026-05-25", type: "Holiday", description: "Summer vacation starts" },
  { id: "ev8", title: "Independence Day", date: "2026-08-15", type: "Holiday", description: "National Holiday" },
  { id: "ev9", title: "Final Exams Begin", date: "2026-09-10", type: "Exam", description: "Final examinations for all grades" },
  { id: "ev10", title: "Staff Meeting", date: "2026-04-25", type: "Meeting", description: "Monthly staff review meeting" },
];

export const initialNotifications: Notification[] = [
  { id: "nt1", message: "3 students marked absent today in 10th Std", time: "10 minutes ago", read: false },
  { id: "nt2", message: "Fee payment received from Aarav Sharma", time: "1 hour ago", read: false },
  { id: "nt3", message: "New notice posted: Annual Sports Day", time: "2 hours ago", read: false },
  { id: "nt4", message: "Mid-Term results published for 10th Std", time: "1 day ago", read: false },
  { id: "nt5", message: "Parent-Teacher Meeting scheduled for April 28", time: "2 days ago", read: false },
];
