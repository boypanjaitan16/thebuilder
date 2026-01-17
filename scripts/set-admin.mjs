import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const {
  VITE_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_ADMIN_USER_ID,
  SUPABASE_ADMIN_ROLE,
} = process.env

if (!VITE_SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !SUPABASE_ADMIN_USER_ID) {
  console.error(
    'Missing env vars. Please set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ADMIN_USER_ID in .env before running.',
  )
  process.exit(1)
}

const supabase = createClient(VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function run() {
  const { error } = await supabase.auth.admin.updateUserById(SUPABASE_ADMIN_USER_ID, {
    user_metadata: { role: SUPABASE_ADMIN_ROLE },
  })

  if (error) {
    console.error('Failed to update user metadata:', error.message)
    process.exit(1)
  }

  console.log(
    `User ${SUPABASE_ADMIN_USER_ID} updated with role=${SUPABASE_ADMIN_ROLE} in user_metadata.`,
  )
}

run()
