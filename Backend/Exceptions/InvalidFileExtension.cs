using System;

namespace Backend.Exceptions
{
    public class InvalidFileExtension : Exception
    {
        public InvalidFileExtension() : base() { }

        public InvalidFileExtension(string message) : base(message) { }

        public InvalidFileExtension(string message, Exception innerException) : base(message, innerException) { }
    }
}
