using System;

namespace Backend.Exceptions
{
    public class EmailIsAlreadyInUseException : Exception
    {
        public EmailIsAlreadyInUseException() : base() { }

        public EmailIsAlreadyInUseException(string message) : base(message) { }

        public EmailIsAlreadyInUseException(string message, Exception innerException) : base(message, innerException) { }
    }
}
