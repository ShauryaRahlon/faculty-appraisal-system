import { NextResponse } from "next/server";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";

export async function GET(request: Request) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const force = searchParams.get("force") === "true";

  if (force) {
    await User.deleteMany({});
    console.log("Force mode: deleted all existing users before re-seeding.");
  }

  const rawData = [
    {
      "SL": "1",
      "UNITS": "JIIT Noida Sec-128",
      "CODE": "JIIT1068",
      "NAME": "KRISHNA ASAWA",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "PROFESSOR"
    },
    {
      "SL": "2",
      "UNITS": "JIIT Noida Sec-128",
      "CODE": "JIIT1137",
      "NAME": "SHIKHA MEHTA",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "PROFESSOR"
    },
    {
      "SL": "3",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT1150",
      "NAME": "ANUJA  ARORA",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "PROFESSOR"
    },
    {
      "SL": "4",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT1213",
      "NAME": "MANISH KUMAR THAKUR",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "PROFESSOR"
    },
    {
      "SL": "5",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT1532",
      "NAME": "NEETU  SARDANA",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "PROFESSOR"
    },
    {
      "SL": "6",
      "UNITS": "JIIT Noida Sec-128",
      "CODE": "JIIT1616",
      "NAME": "MUKESH  SARASWAT",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "PROFESSOR"
    },
    {
      "SL": "7",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT1051",
      "NAME": "K.RAJALAKSHMI",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSOCIATE PROFESSOR"
    },
    {
      "SL": "8",
      "UNITS": "JIIT Noida Sec-128",
      "CODE": "JIIT1088",
      "NAME": "MUKTA GOYAL",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSOCIATE PROFESSOR"
    },
    {
      "SL": "9",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT1121",
      "NAME": "TRIBHUWAN KUMAR TEWARI",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSOCIATE PROFESSOR"
    },
    {
      "SL": "10",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT1156",
      "NAME": "PRAKASH KUMAR",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSOCIATE PROFESSOR"
    },
    {
      "SL": "11",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT1219",
      "NAME": "KAVITA  PANDEY",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSOCIATE PROFESSOR"
    },
    {
      "SL": "12",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT1228",
      "NAME": "INDU CHAWLA",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSOCIATE PROFESSOR"
    },
    {
      "SL": "13",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT1229",
      "NAME": "SUMA  DAWN",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSOCIATE PROFESSOR"
    },
    {
      "SL": "14",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT1324",
      "NAME": "PARMEET KAUR SODHI",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSOCIATE PROFESSOR"
    },
    {
      "SL": "15",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT1355",
      "NAME": "SHIKHA JAIN",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSOCIATE PROFESSOR"
    },
    {
      "SL": "16",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT1670",
      "NAME": "TAJ  ALAM",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSOCIATE PROFESSOR"
    },
    {
      "SL": "17",
      "UNITS": "JIIT Noida Sec-128",
      "CODE": "JIIT1695",
      "NAME": "HIMANI  BANSAL",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSOCIATE PROFESSOR"
    },
    {
      "SL": "18",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT1740",
      "NAME": "AMARJEET",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSOCIATE PROFESSOR"
    },
    {
      "SL": "19",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT1824",
      "NAME": "ANKIT  VIDYARTHI",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSOCIATE PROFESSOR"
    },
    {
      "SL": "20",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT1857",
      "NAME": "ANITA  SAHOO",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSOCIATE PROFESSOR"
    },
    {
      "SL": "21",
      "UNITS": "JIIT Noida Sec-128",
      "CODE": "JIIT1135",
      "NAME": "ARTI JAIN",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "22",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT1174",
      "NAME": "HEMA  NAGARAJA",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "23",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT1220",
      "NAME": "PAWAN KUMAR UPADHYAY",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "24",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT1408",
      "NAME": "MEGHA RATHI",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "25",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT1423",
      "NAME": "DHANALEKSHMI  GOPINATHAN",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "26",
      "UNITS": "JIIT Noida Sec-128",
      "CODE": "JIIT1497",
      "NAME": "HIMANSHU  AGRAWAL",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "27",
      "UNITS": "JIIT Noida Sec-128",
      "CODE": "JIIT1501",
      "NAME": "ANUBHUTI RODA MOHINDRA",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "28",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT1508",
      "NAME": "NIYATI  AGGRAWAL",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "29",
      "UNITS": "JIIT Noida Sec-128",
      "CODE": "JIIT1518",
      "NAME": "GAURAV KUMAR NIGAM",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "30",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT1515",
      "NAME": "AMANPREET  KAUR",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "31",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT1546",
      "NAME": "ARPITA JADHAV BHATT",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "32",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT1554",
      "NAME": "SHARDHA  PORWAL",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "33",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT1557",
      "NAME": "SAKSHI  GUPTA",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "34",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT1570",
      "NAME": "PARUL  AGARWAL",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "35",
      "UNITS": "JIIT Noida Sec-128",
      "CODE": "JIIT1573",
      "NAME": "ADITI  SHARMA",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "36",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT1575",
      "NAME": "ANKITA",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "37",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT1579",
      "NAME": "SOMYA  JAIN",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "38",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT1667",
      "NAME": "KASHAV  AJMERA",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "39",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT1691",
      "NAME": "KIRTI  AGGARWAL",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "40",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT1715",
      "NAME": "POTUKUCHI RAGHU VAMSI",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "41",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT1716",
      "NAME": "SHERRY  GARG",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "42",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT1742",
      "NAME": "MRADULA  SHARMA",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "43",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT1784",
      "NAME": "ANKITA  VERMA",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "44",
      "UNITS": "JIIT Noida Sec-128",
      "CODE": "JIIT1807",
      "NAME": "RASHMI  KUSHWAH",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "45",
      "UNITS": "JIIT Noida Sec-128",
      "CODE": "JIIT1811",
      "NAME": "SHRUTI  JAISWAL",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "46",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT1812",
      "NAME": "SONAL",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "47",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT1880",
      "NAME": "ALKA  SINGHAL",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "48",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT1879",
      "NAME": "ASHISH  MISHRA",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "49",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT1888",
      "NAME": "SULABH  TYAGI",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "50",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT1915",
      "NAME": "BHAWNA   SAXENA",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "51",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT1926",
      "NAME": "VIKASH",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "52",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT1949",
      "NAME": "KAPIL  MADAN",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "53",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT1958",
      "NAME": "AMIT  MISHRA",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "54",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT1987",
      "NAME": "SHWETA  RANI",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "55",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT1998",
      "NAME": "DEEPIKA VARSHNEY",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "56",
      "UNITS": "JIIT Noida Sec-128",
      "CODE": "JIIT2002",
      "NAME": "SHRUTI  GUPTA",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "57",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT2003",
      "NAME": "ANIL KUMAR MAHTO",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "58",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT2005",
      "NAME": "ANKITA  JAISWAL",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "59",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT2015",
      "NAME": "MEENAL  JAIN",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "60",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT2016",
      "NAME": "ASMITA  YADAV",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "61",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT2020",
      "NAME": "JAGRITI",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "62",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT2021",
      "NAME": "KIRTI  JAIN",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "63",
      "UNITS": "JIIT Noida Sec-128",
      "CODE": "JIIT2048",
      "NAME": "KEDAR NATH SINGH",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "64",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT2059",
      "NAME": "TARUN  AGRAWAL",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "65",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT2060",
      "NAME": "VARUN  SRIVASTAVA",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "66",
      "UNITS": "JIIT Noida Sec-128",
      "CODE": "JIIT2073",
      "NAME": "LALITA  MISHRA",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "67",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT2076",
      "NAME": "JASMIN",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "68",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT2080",
      "NAME": "RAJIV KUMAR MISHRA",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "69",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT2083",
      "NAME": "AASTHA  MAHESHWARI",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "70",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT2110",
      "NAME": "PRATIK  SHRIVASTAVA",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "71",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT2125",
      "NAME": "TANVI   GAUTAM",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "72",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT2127",
      "NAME": "SHOBHIT  TYAGI",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "73",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT2136",
      "NAME": "SAYANI  GHOSAL",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "74",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT2135",
      "NAME": "DIKSHA  CHAWLA",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "75",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT2142",
      "NAME": "ANUPAMA  PADHA",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "76",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT2144",
      "NAME": "NAVEEN  CHAUHAN",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "77",
      "UNITS": "JIIT Noida Sec-128",
      "CODE": "JIIT2150",
      "NAME": "NEERAJ  PATHAK",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "78",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT2175",
      "NAME": "AYUSH  SAHU",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "79",
      "UNITS": "JIIT Noida Sec-128",
      "CODE": "JIIT2209",
      "NAME": "VIKAS  SHARMA",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "80",
      "UNITS": "JIIT Noida Sec-128",
      "CODE": "JIIT2231",
      "NAME": "BHAVANA  BANSAL",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "81",
      "UNITS": "JIIT Noida Sec-128",
      "CODE": "JIIT2272",
      "NAME": "DEEPTI  SINGH",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "82",
      "UNITS": "JIIT Noida Sec-128",
      "CODE": "JIIT2273",
      "NAME": "RUCHIKA  BALA",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "83",
      "UNITS": "JIIT Noida Sec-128",
      "CODE": "JIIT2286",
      "NAME": "AKANSHA   SINGH",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "84",
      "UNITS": "JIIT Noida Sec-128",
      "CODE": "JIIT2291",
      "NAME": "JYOTI  RANI",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR (SR GRADE)"
    },
    {
      "SL": "85",
      "UNITS": "JIIT Noida Sec-128",
      "CODE": "JIIT1514",
      "NAME": "AMBALIKA  SARKAR",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR(GRADE II)"
    },
    {
      "SL": "86",
      "UNITS": "JIIT Noida Sec-128",
      "CODE": "JIIT1569",
      "NAME": "AKANKSHA  MEHNDIRATTA",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR(GRADE II)"
    },
    {
      "SL": "87",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT1604",
      "NAME": "PRASHANT  KAUSHIK",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR(GRADE II)"
    },
    {
      "SL": "88",
      "UNITS": "JIIT Noida Sec-128",
      "CODE": "JIIT1696",
      "NAME": "SHARIQ  MURTUZA",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR(GRADE II)"
    },
    {
      "SL": "89",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT1741",
      "NAME": "AMARJEET  KAUR",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR(GRADE II)"
    },
    {
      "SL": "90",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT1769",
      "NAME": "SARISHTY  GUPTA",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR(GRADE II)"
    },
    {
      "SL": "91",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT1783",
      "NAME": "DEEPTI",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR(GRADE II)"
    },
    {
      "SL": "92",
      "UNITS": "JIIT Noida Sec-128",
      "CODE": "JIIT1939",
      "NAME": "ASHISH  KUMAR",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR(GRADE II)"
    },
    {
      "SL": "93",
      "UNITS": "JIIT Noida Sec-128",
      "CODE": "JIIT1952",
      "NAME": "JANARDAN KUMAR VERMA",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR(GRADE II)"
    },
    {
      "SL": "94",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT2001",
      "NAME": "AMITESH",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR(GRADE II)"
    },
    {
      "SL": "95",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT2086",
      "NAME": "ASTHA  SINGH",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR(GRADE II)"
    },
    {
      "SL": "96",
      "UNITS": "JIIT Noida Sec-128",
      "CODE": "JIIT2104",
      "NAME": "PANKAJ   MISHRA",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR(GRADE II)"
    },
    {
      "SL": "97",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT2107",
      "NAME": "SONAL  SAURABH",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR(GRADE II)"
    },
    {
      "SL": "98",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT2106",
      "NAME": "NEHA",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR(GRADE II)"
    },
    {
      "SL": "99",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT2114",
      "NAME": "PUSHP",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR(GRADE II)"
    },
    {
      "SL": "100",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT2122",
      "NAME": "AARTI   GOEL",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR(GRADE II)"
    },
    {
      "SL": "101",
      "UNITS": "JIIT Noida Sec-128",
      "CODE": "JIIT2128",
      "NAME": "SATYA PRAKASH  PATEL",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR(GRADE II)"
    },
    {
      "SL": "102",
      "UNITS": "JIIT Noida Sec-128",
      "CODE": "JIIT2134",
      "NAME": "TWINKLE  TYAGI",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR(GRADE II)"
    },
    {
      "SL": "103",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT2159",
      "NAME": "MEGH  SINGHAL",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR(GRADE II)"
    },
    {
      "SL": "104",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT2189",
      "NAME": "SILKI  KHARALIYA",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR(GRADE II)"
    },
    {
      "SL": "105",
      "UNITS": "JIIT Noida Sec-128",
      "CODE": "JIIT2221",
      "NAME": "ANKIT KUMAR SAINI",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR(GRADE II)"
    },
    {
      "SL": "106",
      "UNITS": "JIIT Noida Sec-128",
      "CODE": "JIIT2245",
      "NAME": "JYOTI",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR(GRADE II)"
    },
    {
      "SL": "107",
      "UNITS": "JIIT Noida Sec-128",
      "CODE": "JIIT2249",
      "NAME": "SANTOSH KUMAR RAY",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR(GRADE II)"
    },
    {
      "SL": "108",
      "UNITS": "JIIT Noida Sec-128",
      "CODE": "JIIT2290",
      "NAME": "MEENU  SHUKLA",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR(GRADE II)"
    },
    {
      "SL": "109",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT1300",
      "NAME": "PURTEE  KOHLI",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR(GRADE I)"
    },
    {
      "SL": "110",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT2109",
      "NAME": "SUMESHWAR  SINGH",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR(GRADE I)"
    },
    {
      "SL": "111",
      "UNITS": "JIIT Noida Sec-128",
      "CODE": "JIIT2133",
      "NAME": "AYUSHI  PANDEY",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR(GRADE I)"
    },
    {
      "SL": "112",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT2141",
      "NAME": "AKSHIT  RAJ  PATEL",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR(GRADE I)"
    },
    {
      "SL": "113",
      "UNITS": "JIIT Noida Sec-128",
      "CODE": "JIIT2145",
      "NAME": "ADITI  PRIYA",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR(GRADE I)"
    },
    {
      "SL": "114",
      "UNITS": "JIIT Noida Sec-128",
      "CODE": "JIIT2146",
      "NAME": "NIVEDITTA  BATRA",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR(GRADE I)"
    },
    {
      "SL": "115",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT2160",
      "NAME": "PRATEEK  KUMAR SONI",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR(GRADE I)"
    },
    {
      "SL": "116",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT2157",
      "NAME": "SHIVENDRA VIKRAM SINGH",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR(GRADE I)"
    },
    {
      "SL": "117",
      "UNITS": "JIIT Noida Sec-128",
      "CODE": "JIIT2206",
      "NAME": "ANSHUL  SINGH",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR(GRADE I)"
    },
    {
      "SL": "118",
      "UNITS": "JIIT Noida Sec-128",
      "CODE": "JIIT2226",
      "NAME": "GAURAV",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR(GRADE I)"
    },
    {
      "SL": "119",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT2227",
      "NAME": "RICHA  KUSHWAHA",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR(GRADE I)"
    },
    {
      "SL": "120",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT2228",
      "NAME": "ANUJA  SHUKLA",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR(GRADE I)"
    },
    {
      "SL": "121",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT2253",
      "NAME": "RITIKA  CHAUDHARY",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR(GRADE I)"
    },
    {
      "SL": "122",
      "UNITS": "JIIT Noida Sec-128",
      "CODE": "JIIT2260",
      "NAME": "RISHABH  NEGI",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR(GRADE I)"
    },
    {
      "SL": "123",
      "UNITS": "JIIT Noida Sec-128",
      "CODE": "JIIT2269",
      "NAME": "VICKY  GUPTA",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR(GRADE I)"
    },
    {
      "SL": "124",
      "UNITS": "JIIT Noida Sec-128",
      "CODE": "JIIT2276",
      "NAME": "MOHIT  SINGH",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR(GRADE I)"
    },
    {
      "SL": "125",
      "UNITS": "JIIT Noida Sec-128",
      "CODE": "JIIT2287",
      "NAME": "MADHAV  BANSAL",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR(GRADE I)"
    },
    {
      "SL": "126",
      "UNITS": "JIIT Noida Sec-128",
      "CODE": "JIIT2292",
      "NAME": "HIMIKA  VERMA",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR(GRADE I)"
    },
    {
      "SL": "127",
      "UNITS": "JIIT Noida Sec-128",
      "CODE": "JIIT2301",
      "NAME": "KASHISH  MAHAJAN",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR(GRADE I)"
    },
    {
      "SL": "128",
      "UNITS": "JIIT Noida Sec-128",
      "CODE": "JIIT2309",
      "NAME": "DHRUV  GARG",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR(GRADE I)"
    },
    {
      "SL": "129",
      "UNITS": "JIIT Noida Sec-128",
      "CODE": "JIIT2310",
      "NAME": "NOOR  MOHAMMAD",
      "CADRE": "REG",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "ASSISTANT PROFESSOR(GRADE I)"
    },
    {
      "SL": "130",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIITC158",
      "NAME": "NETRAMBAKAM  DEVASAIKUMAR",
      "CADRE": "CON",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "FACULTY SCHOLAR"
    },
    {
      "SL": "131",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIITC160",
      "NAME": "ISHIKA  ARORA",
      "CADRE": "CON",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "FACULTY SCHOLAR"
    },
    {
      "SL": "132",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIITC162",
      "NAME": "SAMARTH  SONI",
      "CADRE": "CON",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "FACULTY FELLOW"
    },
    {
      "SL": "133",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIITC163",
      "NAME": "SAMARTH  JAIN",
      "CADRE": "CON",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "FACULTY FELLOW"
    },
    {
      "SL": "134",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIITC159",
      "NAME": "BAIBHAV  SINGH",
      "CADRE": "CON",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "FACULTY FELLOW"
    },
    {
      "SL": "135",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIITC161",
      "NAME": "JATIN  GUPTA",
      "CADRE": "CON",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "FACULTY FELLOW"
    },
    //   testing id
    {
      "SL": "136",
      "UNITS": "JIIT Noida Sec-62",
      "CODE": "JIIT11111",
      "NAME": "Tashif  Ahmad Khan",
      "CADRE": "CON",
      "DEPARTMENT": "COMPUTER SCIENCE/ INFO. TECH.",
      "DESIGNATION": "FACULTY FELLOW"
    }
  ];

  const defaultPasswordHash = await bcrypt.hash("jiit123", 10);
  let createdCount = 0;

  for (const row of rawData) {
    // Generate a dummy email if not provided
    // In production, you MUST provide real emails for OTP to work
    const generatedEmail = `${row.NAME.toLowerCase().replace(/\s+/g, '.')}@jiit.ac.in`;

    // Check if user exists
    const exists = await User.findOne({ employeeCode: row.CODE });

    if (!exists) {
      await User.create({
        employeeCode: row.CODE,
        name: row.NAME,
        email: generatedEmail, // This email receives the OTP
        password: defaultPasswordHash, // Default password for first login
        department: row.DEPARTMENT,
        designation: row.DESIGNATION,
        unit: row.UNITS,
        role: "faculty",
        isVerified: false // Forces OTP flow on first login
      });
      createdCount++;
    }
  }

  // --- Seed Admin User ---
  const adminExists = await User.findOne({ employeeCode: "ADMIN" });
  let adminCreated = false;
  if (!adminExists) {
    const adminPasswordHash = await bcrypt.hash("Admin128", 10);
    await User.create({
      employeeCode: "ADMIN",
      name: "Admin",
      email: "admin@jiit.ac.in",
      password: adminPasswordHash,
      department: "Administration",
      designation: "HOD / Administrator",
      unit: "JIIT Noida",
      role: "admin",
      isVerified: true // No OTP verification needed for admin
    });
    adminCreated = true;
  }

  return NextResponse.json({
    message: `Seeded ${createdCount} faculty users.${adminCreated ? " Admin user created." : " Admin already exists."}`
  });
}