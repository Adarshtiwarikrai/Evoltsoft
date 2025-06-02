<template>
  <nav class="bg-card text-card-foreground border-b border-border shadow-md print:hidden">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        
        <router-link
          to="/"
          class="flex items-center text-xl font-bold text-primary hover:opacity-80 transition-opacity"
          aria-label="ChargerApp Home"
        >
          <Zap class="h-6 w-6 mr-2 text-primary charging-icon" />
          ChargerApp
        </router-link>

        
        <div class="hidden sm:flex items-center space-x-1">
          <template v-if="isAuthenticated">
            <Button :variant="currentRouteName === 'Dashboard' ? 'default' : 'ghost'" as-child>
              <router-link to="/dashboard">Dashboard</router-link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button variant="ghost" class="flex items-center space-x-2">
                  <Avatar v-if="currentUser" class="h-7 w-7 text-xs">
                    <AvatarImage :src="currentUser.avatarUrl" :alt="currentUser.username" />
                    <AvatarFallback>
                      {{ currentUser.username ? currentUser.username.substring(0, 2).toUpperCase() : 'U' }}
                    </AvatarFallback>
                  </Avatar>
                  <span class="hidden md:inline">{{ currentUser?.username || 'Account' }}</span>
                  <ChevronDown class="h-4 w-4 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" class="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled v-if="currentUser">
                  <User class="mr-2 h-4 w-4" />
                  
                  <span>{{ currentUser.email || currentUser.username }}</span>
                </DropdownMenuItem>
                <DropdownMenuItem @click="handleLogout">
                  <LogOut class="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </template>
          <template v-else>
            <Button :variant="currentRouteName === 'Login' ? 'default' : 'ghost'" as-child>
              <router-link to="/login">Login</router-link>
            </Button>
            <Button :variant="currentRouteName === 'Register' ? 'default' : 'ghost'" as-child>
              <router-link to="/register">Register</router-link>
            </Button>
          </template>
        </div>

        
        <div class="sm:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu class="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" class="w-56">
              <template v-if="isAuthenticated">
                <DropdownMenuItem as-child :class="{ 'bg-accent text-accent-foreground': currentRouteName === 'Dashboard' }">
                  <router-link to="/dashboard">
                    <LayoutDashboard class="mr-2 h-4 w-4" /> Dashboard
                  </router-link>
                </DropdownMenuItem>
                <DropdownMenuSeparator v-if="currentUser" />
                <DropdownMenuLabel v-if="currentUser">
                  Logged in as {{ currentUser.username }}
                </DropdownMenuLabel>
                <DropdownMenuItem @click="handleLogout">
                  <LogOut class="mr-2 h-4 w-4" /> Log out
                </DropdownMenuItem>
              </template>
              <template v-else>
                <DropdownMenuItem as-child :class="{ 'bg-accent text-accent-foreground': currentRouteName === 'Login' }">
                  <router-link to="/login">
                    <LogIn class="mr-2 h-4 w-4" /> Login
                  </router-link>
                </DropdownMenuItem>
                <DropdownMenuItem as-child :class="{ 'bg-accent text-accent-foreground': currentRouteName === 'Register' }">
                  <router-link to="/register">
                    <UserPlus class="mr-2 h-4 w-4" /> Register
                  </router-link>
                </DropdownMenuItem>
              </template>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { Button } from '../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Zap, LogOut, User, ChevronDown, Menu, LayoutDashboard, LogIn, UserPlus } from 'lucide-vue-next';

export default {
  name: 'Navbar',
  components: {
    Button,
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
    Avatar, AvatarFallback, AvatarImage,
    Zap, LogOut, User, ChevronDown, Menu, LayoutDashboard, LogIn, UserPlus,
  },
  computed: {
    ...mapGetters('auth', ['isAuthenticated', 'currentUser']),
    currentRouteName() {
      return this.$route.name; 
    }
  },
  methods: {
    ...mapActions('auth', ['logout']),
    handleLogout() {
      this.logout().then(() => {
        
        
        
        if (this.$route.name !== 'Login') { 
          this.$router.push('/login');
        }
      }).catch(error => {
        console.error("Logout failed:", error);
        
        if (this.$route.name !== 'Login') {
          this.$router.push('/login');
        }
      });
    },
  },
};
</script>

<style scoped>
.charging-icon {
  position: relative;
  overflow: hidden; 
  display: inline-block; 
  line-height: 1; 
  animation: icon-pulse 3s ease-in-out infinite;
  transform-origin: center;
}

.charging-icon::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to top,
    rgba(255, 255, 200, 0.6), 
    rgba(255, 255, 200, 0.2) 40%, 
    transparent 70% 
  );
  animation: charge-glow 2.2s ease-in-out infinite;
  opacity: 0.85; 
}


@keyframes charge-glow {
  0% {
    top: 100%; 
    opacity: 0.5;
  }
  45% {
    top: -30%; 
    opacity: 0.85;
  }
  55% { 
    top: -30%;
    opacity: 0.85;
  }
  100% {
    top: 100%; 
    opacity: 0.5;
  }
}


@keyframes icon-pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.9;
  }
}


.charging-icon:hover {
  animation: icon-pulse 1.5s ease-in-out infinite;
}

.charging-icon:hover::after {
  animation: charge-glow 1.5s ease-in-out infinite;
  opacity: 1;
}


</style>