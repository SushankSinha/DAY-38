// 1. Find all the topics and tasks taught in the month of October:

db.topics.find({
  "_id": {
    $in: db.tasks.distinct("topic_id", {
      "submission_date": {
        $gte: ISODate("2020-10-01T00:00:00Z"),
        $lt: ISODate("2020-11-01T00:00:00Z")
      }
    })
  }
}).toArray();

// 2. Find all the company drives that occurred between 15-Oct-2020 and 31-Oct-2020:

db.company_drives.find({
  "drive_date": {
    $gte: ISODate("2020-10-15T00:00:00Z"),
    $lte: ISODate("2020-10-31T23:59:59Z")
  }
}).toArray();

//3. Find all the company drives and students who appeared for placement:

db.company_drives.find().forEach(function(drive) {
  let students = db.attendance.find({
    "date": drive.drive_date
  }).toArray();
  drive.students = students;
});
db.company_drives.toArray();

// 4. Find the number of problems solved by a user in CodeKata:

let userId = //specific user id; 

db.codekata.aggregate([
  {
    $match: { "user_id": userId }
  },
  {
    $group: {
      "_id": null,
      "total_solved_problems": { $sum: "$solved_problems" }
    }
  }
]).toArray();

// 5. Find all the mentors with more than 15 mentees:

db.mentors.find({ "mentee_count": { $gt: 15 } }).toArray();

// 6. Find the number of users who were absent and did not submit a task between 15-Oct-2020 and 31-Oct-2020:

let absentUsers = db.attendance.distinct("user_id", {
  "status": "absent",
  "date": {
    $gte: ISODate("2020-10-15T00:00:00Z"),
    $lte: ISODate("2020-10-31T23:59:59Z")
  }
});

let usersWithSubmittedTasks = db.tasks.distinct("user_id", {
  "submission_date": {
    $gte: ISODate("2020-10-15T00:00:00Z"),
    $lte: ISODate("2020-10-31T23:59:59Z")
  }
});

let result = db.users.count({
  "_id": { $nin: absentUsers },
  "_id": { $nin: usersWithSubmittedTasks }
});
result;