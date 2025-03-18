<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import { login, register } from "@/services/auth.js";
import router from "@/router/index.js";
import Swal from "sweetalert2";

const form = reactive({ email: "", password: "" });
const registerForm = reactive({  
  firstname: "", 
  lastname: "", 
  email: "", 
  password: "", 
  password_confirmation: "" 
});
const isRegisterMode = ref(false);

const toggleMode = () => {
  isRegisterMode.value = !isRegisterMode.value;
};

const submitLogin = async () => { 
  try {
    const res = await login(form);
    if (res) router.push("/");
    else {
      await Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Please check your email or password.",
        confirmButtonColor: "#d33",
      });
    }
  } catch (err) {
    console.error("Error during login:", err);
    await Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "An error occurred during login. Please try again later.",
      confirmButtonColor: "#d33",
    });
  }
};

const submitRegister = async () => {
  try {
    console.log("Submitting registration with data:", registerForm);
    const res = await register(registerForm);
    if (res) {
      router.push("/");
    } else {
      await Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: "Please check your details or ensure passwords match.",
        confirmButtonColor: "#d33",
      });
    }
  } catch (err) {
    console.error("Registration error details:", err.response?.data || err);
    const errorMessage = err.response?.data?.message || "An error occurred during registration.";
    const validationErrors = err.response?.data?.errors ? Object.values(err.response.data.errors).flat().join(" ") : "";
    let userMessage = validationErrors || errorMessage;
    if (validationErrors.includes("email has already been taken")) {
      userMessage = "This email is already registered. Please use a different email or log in.";
    }
    await Swal.fire({
      icon: "error",
      title: "Registration Error",
      text: userMessage,
      confirmButtonColor: "#d33",
    });
  }
};



const initParticles = () => {
  if (window.particlesJS) {
    window.particlesJS("particles-js", {
      particles: {
        number: { value: 90, density: { enable: true, value_area: 800 } },
        color: { value: "#ffffff" },
        shape: { type: "circle" },
        opacity: { value: 0.6, random: true },
        size: { value: 3, random: true },
        line_linked: { enable: true, distance: 140, color: "#ffffff", opacity: 0.4, width: 1 },
        move: { enable: true, speed: 2, direction: "none", random: false, straight: false, out_mode: "out" },
      },
      interactivity: {
        detect_on: "canvas",
        events: { onhover: { enable: true, mode: "repulse" } },
        modes: { repulse: { distance: 120, duration: 0.4 } },
      },
      retina_detect: true,
    });
  } else console.error("Particles.js is not loaded.");
};

onMounted(() => { 
  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js";
  script.async = true;
  script.onload = () => initParticles();
  script.onerror = () => console.error("Failed to load particles.js");
  document.body.appendChild(script);
});
</script>

<template>
  <section class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-gray-800 to-gray-700 relative">
    <div id="particles-js" class="absolute inset-0 z-0"></div>
    <div class="relative z-10 w-full max-w-lg bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20 transform transition-all duration-500">
      <h2 class="text-4xl font-extrabold text-center text-white mb-8 tracking-wide">
        {{ isRegisterMode ? "Join LaVue" : "Welcome Back" }}
      </h2>

      <form v-if="!isRegisterMode" @submit.prevent="submitLogin" class="space-y-6">
        <div class="relative">
          <label for="email" class="block text-sm font-medium text-gray-300">Email</label>
          <div class="mt-1 relative">
            <input v-model="form.email" type="email" id="email" required placeholder="Your email"
              class="input-field"/>
          </div>
        </div>
        <div class="relative">
          <label for="password" class="block text-sm font-medium text-gray-300">Password</label>
          <div class="mt-1 relative">
            <input v-model="form.password" type="password" id="password" required placeholder="Your password"
              class="input-field"/>
          </div>
        </div>
        <button type="submit" class="btn-primary">Sign In</button>
      </form>

      <form v-if="isRegisterMode" @submit.prevent="submitRegister" class="space-y-6">
        <div class="relative">
          <label for="firstname" class="block text-sm font-medium text-gray-300">First Name</label>
          <div class="mt-1 relative">
            <input v-model="registerForm.firstname" type="text" id="firstname" required placeholder="Your first name"
              class="input-field"/>
          </div>
        </div>
        <div class="relative">
          <label for="lastname" class="block text-sm font-medium text-gray-300">Last Name</label>
          <div class="mt-1 relative">
            <input v-model="registerForm.lastname" type="text" id="lastname" required placeholder="Your last name"
              class="input-field"/>
          </div>
        </div>
        <div class="relative">
          <label for="reg-email" class="block text-sm font-medium text-gray-300">Email</label>
          <div class="mt-1 relative">
            <input v-model="registerForm.email" type="email" id="reg-email" required placeholder="Your email"
              class="input-field"/>
          </div>
        </div>
        <div class="relative">
          <label for="reg-password" class="block text-sm font-medium text-gray-300">Password</label>
          <div class="mt-1 relative">
            <input v-model="registerForm.password" type="password" id="reg-password" required placeholder="Create a password"
              class="input-field"/>
          </div>
        </div>
        <div class="relative">
          <label for="reg-password-confirm" class="block text-sm font-medium text-gray-300">Confirm Password</label>
          <div class="mt-1 relative">
            <input v-model="registerForm.password_confirmation" type="password" id="reg-password-confirm" required placeholder="Confirm your password"
              class="input-field"/>
          </div>
        </div>
        <button type="submit" class="btn-primary">Sign Up</button>
      </form>

      <div class="mt-8 text-center">
        <p class="text-sm text-gray-300">
          {{ isRegisterMode ? "Already a member?" : "New here?" }}
          <button @click="toggleMode" class="text-cyan-400 hover:text-cyan-300 font-medium transition-all duration-300 hover:underline">
            {{ isRegisterMode ? "Sign In" : "Sign Up" }}
          </button>
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.input-field {
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: white;
  placeholder: rgba(255, 255, 255, 0.5);
  transition: 0.3s;
}

.input-field:focus {
  outline: none;
  border-color: cyan;
}

.btn-primary {
  width: 100%;
  padding: 12px;
  background-color: aqua;
  color: white;
  font-weight: bold;
  border-radius: 8px;
  transition: 0.3s;
}

.btn-primary:hover {
  background-color: aqua;
}
</style>