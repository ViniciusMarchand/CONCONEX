using System;

namespace Backend.Exceptions
{
    public class ClientIsAlreadyAddedException : Exception
    {
        public ClientIsAlreadyAddedException() : base() { }

        public ClientIsAlreadyAddedException(string message) : base(message) { }

        public ClientIsAlreadyAddedException(string message, Exception innerException) : base(message, innerException) { }
    }
}
