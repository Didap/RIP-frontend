<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/lib/auth'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'

const router = useRouter()
const { login } = useAuth()

const identifier = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleSubmit() {
  error.value = ''
  loading.value = true

  try {
    await login(identifier.value, password.value)
    router.push('/dashboard')
  } catch (e: any) {
    error.value = e.message || 'Errore durante il login'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
    <div class="flex w-full max-w-sm flex-col gap-6">
      <a href="#" class="flex items-center gap-2 self-center font-medium">
        <span class="text-xl font-semibold">RIP</span>
      </a>

      <div :class="cn('flex flex-col gap-6')">
        <Card>
          <CardHeader class="text-center">
            <CardTitle class="text-xl">
              Bentornato
            </CardTitle>
            <CardDescription>
              Accedi al pannello di gestione
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form @submit.prevent="handleSubmit">
              <FieldGroup>
                <Field>
                  <FieldLabel for="identifier">
                    Email o Username
                  </FieldLabel>
                  <Input
                    id="identifier"
                    v-model="identifier"
                    type="text"
                    placeholder="m@example.com"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel for="password">
                    Password
                  </FieldLabel>
                  <Input
                    id="password"
                    v-model="password"
                    type="password"
                    required
                  />
                </Field>
                <div v-if="error" class="text-sm text-red-500 text-center">
                  {{ error }}
                </div>
                <Field>
                  <Button type="submit" :disabled="loading" class="w-full">
                    {{ loading ? 'Accesso in corso...' : 'Accedi' }}
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
