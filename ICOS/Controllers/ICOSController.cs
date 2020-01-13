using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ICOS.DataAccess;
using ICOS.Models.ViewModel;
using Microsoft.AspNetCore.Mvc;

namespace ICOS.Controllers
{
    public class ICOSController : Controller
    {
        public IActionResult Login()
        {
            return View();
        }

        public IActionResult PatientStatus()
        {
            return View();
        }
        public IActionResult MainScadaDashoard()
        {
            return View();
        }

        public IActionResult TeleHealth()
        {
            return View();
        }
        [HttpPost]
        public PartialViewResult TeleHealthSearchPage()
        {
            return PartialView();
        }

        public IActionResult DoctorStatus()
        {
            List<ScheduleFields> Appoint = new List<ScheduleFields>();
            Appoint.Add(new ScheduleFields { Id = "1", Subject = "Meeting One", StartTime = new DateTime(2019, 12, 30, 00, 00, 00), EndTime = new DateTime(2019, 12, 30, 01, 00, 00), Description = "", AllDay = false, Recurrence = false, RecurrenceRule = "", DoctorId = "1" });
            Appoint.Add(new ScheduleFields { Id = "1", Subject = "Meeting Two", StartTime = new DateTime(2019, 12, 30, 01, 00, 00), EndTime = new DateTime(2019, 12, 30, 02, 00, 00), Description = "", AllDay = false, Recurrence = false, RecurrenceRule = "", DoctorId = "2" });
            Appoint.Add(new ScheduleFields { Id = "1", Subject = "Meeting Three", StartTime = new DateTime(2019, 12, 30, 02, 00, 00), EndTime = new DateTime(2019, 12, 30, 03, 00, 00), Description = "", AllDay = false, Recurrence = false, RecurrenceRule = "", DoctorId = "3" });
            Appoint.Add(new ScheduleFields { Id = "1", Subject = "Meeting Four", StartTime = new DateTime(2019, 12, 30, 03, 00, 00), EndTime = new DateTime(2019, 12, 30, 04, 00, 00), Description = "", AllDay = false, Recurrence = false, RecurrenceRule = "", DoctorId = "4" });
            Appoint.Add(new ScheduleFields { Id = "1", Subject = "Meeting Five", StartTime = new DateTime(2019, 12, 30, 04, 00, 00), EndTime = new DateTime(2019, 12, 30, 05, 00, 00), Description = "", AllDay = false, Recurrence = false, RecurrenceRule = "", DoctorId = "5" });
            Appoint.Add(new ScheduleFields { Id = "1", Subject = "Meeting Six", StartTime = new DateTime(2019, 12, 30, 05, 00, 00), EndTime = new DateTime(2019, 12, 30, 06, 00, 00), Description = "", AllDay = false, Recurrence = false, RecurrenceRule = "", DoctorId = "6" });
            ViewBag.Appoint = Appoint;
            List < String > Group = new List<String>();
            Group.Add("Doctors");
            ViewBag.Group = Group;


            List< ResourceFields > Doctor = new List<ResourceFields>();
            Doctor.Add(new ResourceFields { Id = "1", Text = "Dr.James", Color = "#f8a398", GroupId = "1" });
            Doctor.Add(new ResourceFields { Id = "2", Text = "Dr.Marcus", Color = "#56ca95", GroupId = "1" });
            Doctor.Add(new ResourceFields { Id = "3", Text = "Dr.Mark", Color = "#f8a398", GroupId = "1" });
            Doctor.Add(new ResourceFields { Id = "4", Text = "Dr.Antony", Color = "#56ca95", GroupId = "1" });
            Doctor.Add(new ResourceFields { Id = "5", Text = "Dr.Paul", Color = "#f8a398", GroupId = "1" });
            Doctor.Add(new ResourceFields { Id = "6", Text = "Dr.Fred", Color = "#56ca95", GroupId = "1" });
            ViewBag.Doctor = Doctor;
            return View();
        }

        public IActionResult InventoryManagement()
        {
            return View();
        }

        public IActionResult DummyPage()
        {
           
            return View();
        }
    }
}