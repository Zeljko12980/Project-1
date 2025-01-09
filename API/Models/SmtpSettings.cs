namespace API.Models
{
    public class SmtpSettings
    {
        /// <summary>
        /// SMTP server address (e.g., smtp.gmail.com).
        /// </summary>
        public string Server { get; set; }

        /// <summary>
        /// Port used for SMTP communication (e.g., 587).
        /// </summary>
        public int Port { get; set; }

        /// <summary>
        /// Name of the email sender (e.g., shown in the email client).
        /// </summary>
        public string SenderName { get; set; }

        /// <summary>
        /// Email address used for sending the email.
        /// </summary>
        public string SenderEmail { get; set; }

        /// <summary>
        /// Username for the SMTP server (e.g., email address).
        /// </summary>
        public string Username { get; set; }

        /// <summary>
        /// Password for the SMTP server.
        /// </summary>
        public string Password { get; set; }

        /// <summary>
        /// Whether SSL should be enabled for the connection.
        /// </summary>
        public bool EnableSsl { get; set; }
    }
}