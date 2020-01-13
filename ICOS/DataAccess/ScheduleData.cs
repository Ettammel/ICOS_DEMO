using ICOS.Models.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ICOS.DataAccess
{
    public class ScheduleData
    {
        public List<AppointmentData> GetScheduleData()
        {
            List<AppointmentData> appData = new List<AppointmentData>();
            appData.Add(new AppointmentData
            {
                Id = 1,
                Subject = "Explosion of Betelgeuse Star",
                StartTime = new DateTime(2018, 2, 11, 9, 30, 0),
                EndTime = new DateTime(2018, 2, 11, 11, 0, 0),
                GroupId = 1
            });
            appData.Add(new AppointmentData
            {
                Id = 2,
                Subject = "Thule Air Crash Report",
                StartTime = new DateTime(2018, 2, 12, 12, 0, 0),
                EndTime = new DateTime(2018, 2, 12, 14, 0, 0),
                GroupId = 1

            });
            appData.Add(new AppointmentData
            {
                Id = 3,
                Subject = "Blue Moon Eclipse",
                StartTime = new DateTime(2019, 12, 30, 5, 30, 0),
                EndTime = new DateTime(2019, 12, 30, 6, 0, 0),
                GroupId = 2

            });
            appData.Add(new AppointmentData
            {
                Id = 4,
                Subject = "Meteor Showers in 2018",
                StartTime = new DateTime(2019, 12, 30, 9, 0, 0),
                EndTime = new DateTime(2019, 12, 30, 9, 30, 0),
                GroupId=2
            });
            appData.Add(new AppointmentData
            {
                Id = 5,
                Subject = "Milky Way as Melting pot",
                StartTime = new DateTime(2018, 2, 15, 12, 0, 0),
                EndTime = new DateTime(2018, 2, 15, 14, 0, 0),
                GroupId=3
            });
            return appData;
        }
    }
}
