using System;

namespace Backend.Exceptions
{
    public class UsernameIsAlreadyInUseException : Exception
    {
        public UsernameIsAlreadyInUseException() : base() { }

        public UsernameIsAlreadyInUseException(string message) : base(message) { }

        public UsernameIsAlreadyInUseException(string message, Exception innerException) : base(message, innerException) { }
    }
}
