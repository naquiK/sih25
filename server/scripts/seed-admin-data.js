const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const User = require("../model/user-Model")
const Report = require("../model/report-Model")
require("dotenv").config()

// Jharkhand districts and addresses
const jharkhandData = {
  districts: [
    "Ranchi",
    "Dhanbad",
    "Jamshedpur",
    "Bokaro",
    "Deoghar",
    "Hazaribagh",
    "Giridih",
    "Ramgarh",
    "Medininagar",
    "Chaibasa",
  ],
  addresses: {
    Ranchi: [
      "Main Road, Harmu, Ranchi, Jharkhand 834001",
      "Circular Road, Lalpur, Ranchi, Jharkhand 834001",
      "Station Road, Ranchi, Jharkhand 834001",
      "Kanke Road, Ranchi, Jharkhand 834008",
      "Argora, Ranchi, Jharkhand 834002",
    ],
    Dhanbad: [
      "Bank More, Dhanbad, Jharkhand 826001",
      "Hirapur, Dhanbad, Jharkhand 826001",
      "Sardar Patel Nagar, Dhanbad, Jharkhand 826001",
      "Bartand, Dhanbad, Jharkhand 826001",
      "Jharia, Dhanbad, Jharkhand 826001",
    ],
    Jamshedpur: [
      "Bistupur, Jamshedpur, Jharkhand 831001",
      "Sakchi, Jamshedpur, Jharkhand 831001",
      "Kadma, Jamshedpur, Jharkhand 831005",
      "Sonari, Jamshedpur, Jharkhand 831011",
      "Mango, Jamshedpur, Jharkhand 831012",
    ],
    Bokaro: [
      "Sector 4, Bokaro Steel City, Jharkhand 827004",
      "City Centre, Bokaro, Jharkhand 827001",
      "Chas, Bokaro, Jharkhand 827013",
      "Sector 12, Bokaro Steel City, Jharkhand 827012",
      "Jaridih, Bokaro, Jharkhand 827013",
    ],
    Deoghar: [
      "Temple Road, Deoghar, Jharkhand 814112",
      "Station Road, Deoghar, Jharkhand 814112",
      "Rikhia, Deoghar, Jharkhand 814113",
      "Jasidih, Deoghar, Jharkhand 814142",
      "Madhupur, Deoghar, Jharkhand 815353",
    ],
  },
  departments: [
    "water-supply",
    "electricity",
    "sanitation",
    "transportation",
    "public-works",
    "health",
    "education",
    "police",
    "fire-department",
    "municipal-corporation",
  ],
  categories: [
    "road-maintenance",
    "water-supply",
    "electricity",
    "garbage-collection",
    "street-lighting",
    "drainage",
    "public-transport",
    "healthcare",
    "education",
    "law-order",
    "fire-safety",
    "building-permits",
  ],
}

// Sample report descriptions
const reportDescriptions = [
  "Water supply has been disrupted for the past 3 days in our area",
  "Street lights are not working, making it unsafe during night hours",
  "Road has multiple potholes causing traffic issues and vehicle damage",
  "Garbage collection has been irregular, causing hygiene problems",
  "Drainage system is blocked, leading to waterlogging during rains",
  "Power outage for more than 12 hours affecting daily activities",
  "Public transport services are inadequate in this route",
  "Medical facilities are lacking proper equipment and staff",
  "School building needs urgent repair work for student safety",
  "Traffic signals are not functioning properly at this intersection",
]

const seedAdminData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("Connected to MongoDB")

    // Clear existing data
    await User.deleteMany({ role: { $ne: "citizen" } })
    await Report.deleteMany({})
    console.log("Cleared existing admin and report data")

    const hashedPassword = await bcrypt.hash("admin123", 12)

    const superAdmin = new User({
      fullname: "Super Administrator",
      fathername: "System Admin",
      phone: "9999999999",
      email: "superadmin@jharkhand.gov.in",
      password: hashedPassword,
      dateOfBirth: "1980-01-01",
      address: "Secretariat, Ranchi, Jharkhand",
      District: "Ranchi",
      pincode: 834001,
      gender: "prefer-not-to-say",
      role: "super-admin",
      isEmailVerified: true,
      accountVerified: true,
    })
    await superAdmin.save()

    const stateAdmin = new User({
      fullname: "State Administrator",
      fathername: "State Govt",
      phone: "9999999998",
      email: "stateadmin@jharkhand.gov.in",
      password: hashedPassword,
      dateOfBirth: "1985-01-01",
      address: "State Secretariat, Ranchi, Jharkhand",
      District: "Ranchi",
      pincode: 834001,
      gender: "male",
      role: "state-admin",
      isEmailVerified: true,
      accountVerified: true,
    })
    await stateAdmin.save()

    const createdUsers = []

    for (let i = 0; i < jharkhandData.districts.length; i++) {
      const district = jharkhandData.districts[i]
      const districtAdmin = new User({
        fullname: `${district} District Administrator`,
        fathername: "District Collector",
        phone: `999999${String(i).padStart(4, "0")}`,
        email: `districtadmin.${district.toLowerCase()}@jharkhand.gov.in`,
        password: hashedPassword,
        dateOfBirth: "1985-01-01",
        address: jharkhandData.addresses[district]
          ? jharkhandData.addresses[district][0]
          : `District Office, ${district}, Jharkhand`,
        District: district,
        assignedDistrict: district,
        pincode: 834001 + i,
        gender: i % 2 === 0 ? "male" : "female",
        role: "district-admin",
        isEmailVerified: true,
        accountVerified: true,
      })
      await districtAdmin.save()
      createdUsers.push(districtAdmin)
    }

    for (const district of jharkhandData.districts.slice(0, 5)) {
      // First 5 districts
      for (let j = 0; j < jharkhandData.departments.length; j++) {
        const department = jharkhandData.departments[j]
        const deptAdmin = new User({
          fullname: `${department.replace("-", " ").toUpperCase()} Department Head`,
          fathername: "Department Officer",
          phone: `888${String(jharkhandData.districts.indexOf(district)).padStart(2, "0")}${String(j).padStart(4, "0")}`,
          email: `${department}.${district.toLowerCase()}@jharkhand.gov.in`,
          password: hashedPassword,
          dateOfBirth: "1988-01-01",
          address: jharkhandData.addresses[district]
            ? jharkhandData.addresses[district][j % jharkhandData.addresses[district].length]
            : `${department} Office, ${district}, Jharkhand`,
          District: district,
          assignedDistrict: district,
          department: department,
          pincode: 834001 + jharkhandData.districts.indexOf(district),
          gender: j % 2 === 0 ? "male" : "female",
          role: "department-admin",
          isEmailVerified: true,
          accountVerified: true,
        })
        await deptAdmin.save()
        createdUsers.push(deptAdmin)
      }
    }

    for (const district of jharkhandData.districts.slice(0, 3)) {
      // First 3 districts
      for (let j = 0; j < jharkhandData.departments.length; j++) {
        const department = jharkhandData.departments[j]
        // Create 2 workers per department
        for (let k = 0; k < 2; k++) {
          const worker = new User({
            fullname: `${department.replace("-", " ")} Worker ${k + 1}`,
            fathername: "Worker Parent",
            phone: `777${String(jharkhandData.districts.indexOf(district)).padStart(2, "0")}${String(j).padStart(2, "0")}${k}`,
            email: `worker${k + 1}.${department}.${district.toLowerCase()}@jharkhand.gov.in`,
            password: hashedPassword,
            dateOfBirth: "1990-01-01",
            address: jharkhandData.addresses[district] 
              ? jharkhandData.addresses[district][k % jharkhandData.addresses[district].length]
              : `Worker Colony, ${district}, Jharkhand`,
            District: district,
            assignedDistrict: district,
            department: department,
            pincode: 834001 + jharkhandData.districts.indexOf(district),
            gender: (j + k) % 2 === 0 ? "male" : "female",
            role: "worker",
            isEmailVerified: true,
            accountVerified: true,
          })
          await worker.save()
          createdUsers.push(worker)
        }
      }
    }

    for (let i = 0; i < 20; i++) {
      const district = jharkhandData.districts[i % jharkhandData.districts.length]
      const citizen = new User({
        fullname: `Citizen ${i + 1}`,
        fathername: `Father ${i + 1}`,
        phone: `666666${String(i).padStart(4, "0")}`,
        email: `citizen${i + 1}@example.com`,
        password: hashedPassword,
        dateOfBirth: "1995-01-01",
        address: jharkhandData.addresses[district]
          ? jharkhandData.addresses[district][i % jharkhandData.addresses[district].length]
          : `Citizen Area, ${district}, Jharkhand`,
        District: district,
        pincode: 834001 + (i % 10),
        gender: i % 2 === 0 ? "male" : "female",
        role: "citizen",
        isEmailVerified: true,
        accountVerified: true,
      })
      await citizen.save()
      createdUsers.push(citizen)
    }

    console.log(`Created ${createdUsers.length} users`)

    const citizens = createdUsers.filter((user) => user.role === "citizen")
    const departmentAdmins = createdUsers.filter((user) => user.role === "department-admin")
    const workers = createdUsers.filter((user) => user.role === "worker")

    for (let i = 0; i < 50; i++) {
      const citizen = citizens[i % citizens.length]
      const category = jharkhandData.categories[i % jharkhandData.categories.length]
      const urgencyLevels = ["low", "medium", "high"]
      const statuses = ["pending", "in-progress", "resolved"]

      // Find appropriate department admin for this district and category
      const deptAdmin = departmentAdmins.find(
        (admin) =>
          admin.assignedDistrict === citizen.District &&
          admin.department === jharkhandData.departments[i % jharkhandData.departments.length],
      )

      const worker = workers.find(
        (w) =>
          w.assignedDistrict === citizen.District &&
          w.department === (deptAdmin ? deptAdmin.department : jharkhandData.departments[0]),
      )

      const report = new Report({
        title: `${category.replace("-", " ").toUpperCase()} Issue #${i + 1}`,
        description: reportDescriptions[i % reportDescriptions.length],
        category: category,
        urgencyLevel: urgencyLevels[i % urgencyLevels.length],
        status: statuses[i % statuses.length],
        location: {
          address: citizen.address,
          coordinates: {
            latitude: 23.3441 + (Math.random() - 0.5) * 0.1, // Ranchi area coordinates
            longitude: 85.3096 + (Math.random() - 0.5) * 0.1,
          },
        },
        district: citizen.District,
        department: deptAdmin ? deptAdmin.department : jharkhandData.departments[i % jharkhandData.departments.length],
        reportedBy: citizen._id,
        assignedTo: worker ? worker._id : null,
        images: [`https://picsum.photos/400/300?random=${i}`],
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
      })

      await report.save()
    }

    console.log("Created 50 sample reports")
    console.log("✅ Seeding completed successfully!")

    // Print summary
    console.log("\n📊 SEEDING SUMMARY:")
    console.log("==================")
    console.log("👑 Super Admin: 1")
    console.log("🏛️  State Admin: 1")
    console.log(`🏢 District Admins: ${jharkhandData.districts.length}`)
    console.log(
      `🏬 Department Admins: ${jharkhandData.districts.slice(0, 5).length * jharkhandData.departments.length}`,
    )
    console.log(`👷 Workers: ${jharkhandData.districts.slice(0, 3).length * jharkhandData.departments.length * 2}`)
    console.log("👥 Citizens: 20")
    console.log("📋 Reports: 50")
    console.log("\n🔐 Default Password for all users: admin123")
  } catch (error) {
    console.error("Seeding error:", error)
  } finally {
    await mongoose.disconnect()
    console.log("Disconnected from MongoDB")
  }
}

// Run the seeding script
if (require.main === module) {
  seedAdminData()
}

module.exports = seedAdminData

