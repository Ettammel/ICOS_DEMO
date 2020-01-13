using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ICOS.Models.ViewModel
{
    public class ScheduleFields
    {
        public string Id { get; set; }
        public string Subject { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string Description { get; set; }
        public bool AllDay { get; set; }
        public bool Recurrence { get; set; }
        public string RecurrenceRule { get; set; }
        public string DoctorId { get; set; }
    }
}
