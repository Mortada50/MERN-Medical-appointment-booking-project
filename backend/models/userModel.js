import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default:
      "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAtAMBIgACEQEDEQH/xAAbAAEAAwEBAQEAAAAAAAAAAAAAAwQFAgYBB//EADYQAAICAQIEBAQEBAcBAAAAAAABAgMEESEFEjFRMkFhgRMicZEzQlJyI1PB0RRDRGKCoeEG/8QAFgEBAQEAAAAAAAAAAAAAAAAAAAEC/8QAFhEBAQEAAAAAAAAAAAAAAAAAABEB/9oADAMBAAIRAxEAPwD9xAAAAAAAABzKSitZPRFazL/lrX1YFrU4ldXF7zRQlOU/FJs5AvPKrXd+x8/xdf8Au+xSAF9ZNT/Np9USRlGXhkmZgWz1QGqChDInDbxLsyzVfCzbXR9mBMAAAAAAAAAAAAAAAAR3WxrW+78kLrVXHXzfRFCUnKTcnq2AsslY9ZexyAAAW/8AYr5OZTj6qUtZ/pjuBY1QMmfFbH4IRX1epwuJ3+ag/bQDZ1BnU8VhLRW1uPqnqjQjOM4qUJJxfRoD6AALNGS1tb08mW09TLJ8a9wfLPw+T7AXgAAAAAAAAAAOZSUU2+iOipm2bqv3YFeybsnzS+xyAAAI8m1UUysfl0Ap8RzHU/hVv59PmkvIyXu9T625NuT1b6s+FQAAQJ8XJnjWc0fC/FHyZAAr0VVkbK1OD1iyQyOE3ctrqfSe69Ga6IoAALmLbquST3XQsmXGTjJSXVGnCSlFSXRgfQAAAAAAAfGZtkuecpd2X73y1ya7GcgAAAFDjEtMeK7zL5Q4wv4EH2lv9gMgAFZAAAAAEmPLlyKn2mj0R53Hi5X1xXVyR6Ii4AAKFzDlrBx7Mpk+JLS3TugLwAAAAAAAIMx/wWu7KJdzPwvdFJdAAAAEWVT8eida6yW31JQB5nRptSWjQNXiOE5yd1K1l+ePf1RlepWQABQAlox55E1Grp5y7BFnhNXPc7X0hsvqbBxRVGmqNcPCv+zsjQAABJQ9LofUjO6fxYfuA0gAAAAAAAQ5S1pl9ygjTmuaLj3RmdNn1AAAAAABVyMGq966OEv1Lz9i1qNQMefC7k/llGS+xyuG5Le8YpfuNr2Z937MDMp4V/Ps19Ir+poVVxqhyVxUY9kdAAAAAAAEmMtb4/cjLOFHWcpdtgLgAAAAAAABQyoclu35ty+Q5FfxIbdVugKABzZZGqLnY0orqB15kF+XTRtOWsu0d2Z2VxGyzWNOsIPz8yiVK0beKTf4Vaj6y3ZVnmZM3vdNLsnoQADqU5S3lJt+r1OfcACSN9sPDZNf8mT18QyIPeSku0kVABr0cUqm+WcXB99dUXoSjOPNGSafRpnmiSm6yifNVLTv2ZB6IFPEzo5HyyXJZ27lxBQ0MeHJUk+r3ZVxq/iWavoty+AAAAAAAAAAAFHPhGqEr9+VLWWh5nKyZ5M9ZbRXhj2PZyipJprVPqjzXFuFSxm7qE5U9XHTeH/gGUACoAAIAAAAAAAChscMypZEvgy3s8n3Rl49NmRaq6YuUmep4Zw+GFU0mpWS8Uv6IirdVargor3OwAAAAAAAAAAAAHxpM+gDG4hwSFjdmK1Cb6wfR/2MG6mzHny3wcH2Z7cjtpruhyWwjOPZoDxAPR5HAaLHrROVT7NcyM+3geXB/JyWL0loVIzAW5cNzY9caftucrAzH/prPsEVgXocIzp/5PL+5pFyn/5+x6O+6MV2gtWFYpoYPCsjL0lJfCr/AFSW/sjexeGYuM04VqUl+aW7LpBXxMOnEr5KY6d2+r+pYACgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/9k=",
  },
  address: {
    type: Object,
    default: { line1: "", line2: "" },
  },
  gender: {
    type: String,
    default: "Not Selected",
  },
  dob: {
    type: String,
    default: "Not Selected",
  },
  phone: {
    type: String,
    default: "777777777",
  },
});

const userModel = mongoose.model.user || mongoose.model('user', userSchema);
export default userModel;