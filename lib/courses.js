export const COURSE_NAMES = [
  "Computer Basics + Microsoft Office",
  "Digital Literacy + Internet Skills",
  "Data Analytics",
  "Digital Marketing",
  "Graphic Design",
  "Web Development",
];
export const naira = (x) => "₦" + Number(x || 0).toLocaleString("en-NG");

// Default course fees (naira) used to pre-fill the admin enroll form. Keep in step with the homepage prices.
export const COURSE_FEES = {
  "Computer Basics + Microsoft Office": { physical: 50000, online: 35000 },
  "Digital Literacy + Internet Skills": { physical: 30000, online: 20000 },
  "Data Analytics": { physical: 150000, online: 100000 },
  "Digital Marketing": { physical: 100000, online: 70000 },
  "Graphic Design": { physical: 100000, online: 70000 },
  "Web Development": { physical: 200000, online: 150000 },
};

// Picture for each course, used on the homepage and in the student portal.
export const COURSE_IMAGES = {
  "Computer Basics + Microsoft Office": "/courses/computer-basics.svg",
  "Digital Literacy + Internet Skills": "/courses/digital-literacy.svg",
  "Data Analytics": "/courses/data-analytics.svg",
  "Digital Marketing": "/courses/digital-marketing.svg",
  "Graphic Design": "/courses/graphic-design.svg",
  "Web Development": "/courses/web-development.svg",
};
