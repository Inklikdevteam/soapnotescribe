# PocketBase API Migration Guide

## Quick Reference: Supabase → PocketBase

### Authentication

```typescript
// BEFORE (Supabase)
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
});

// AFTER (PocketBase)
const authData = await pb.collection('users').authWithPassword(
  'user@example.com',
  'password'
);
```

### Sign Up

```typescript
// BEFORE (Supabase)
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password'
});

// AFTER (PocketBase)
const user = await pb.collection('users').create({
  email: 'user@example.com',
  password: 'password',
  passwordConfirm: 'password'
});
```

### Get Current User

```typescript
// BEFORE (Supabase)
const { data: { user } } = await supabase.auth.getUser();

// AFTER (PocketBase)
const user = pb.authStore.model;
const isLoggedIn = pb.authStore.isValid;
```

### Sign Out

```typescript
// BEFORE (Supabase)
await supabase.auth.signOut();

// AFTER (PocketBase)
pb.authStore.clear();
```

### Fetch Records

```typescript
// BEFORE (Supabase)
const { data, error } = await supabase
  .from('notes')
  .select('*')
  .eq('user_id', userId);

// AFTER (PocketBase)
const records = await pb.collection('notes').getFullList({
  filter: `user = "${userId}"`
});
```

### Fetch with Pagination

```typescript
// BEFORE (Supabase)
const { data, error } = await supabase
  .from('notes')
  .select('*')
  .range(0, 9);

// AFTER (PocketBase)
const result = await pb.collection('notes').getList(1, 10, {
  sort: '-created'
});
// result.items, result.page, result.totalPages, result.totalItems
```

### Fetch with Relations (Expand)

```typescript
// BEFORE (Supabase)
const { data, error } = await supabase
  .from('notes')
  .select('*, patient(*)')
  .eq('id', noteId)
  .single();

// AFTER (PocketBase)
const record = await pb.collection('notes').getOne(noteId, {
  expand: 'patient'
});
// Access: record.expand.patient
```

### Insert Record

```typescript
// BEFORE (Supabase)
const { data, error } = await supabase
  .from('notes')
  .insert({
    user_id: userId,
    chief_complaint: 'Headache'
  });

// AFTER (PocketBase)
const record = await pb.collection('notes').create({
  user: userId,
  chief_complaint: 'Headache'
});
```

### Update Record

```typescript
// BEFORE (Supabase)
const { data, error } = await supabase
  .from('notes')
  .update({ status: 'completed' })
  .eq('id', noteId);

// AFTER (PocketBase)
const record = await pb.collection('notes').update(noteId, {
  status: 'completed'
});
```

### Delete Record

```typescript
// BEFORE (Supabase)
const { error } = await supabase
  .from('notes')
  .delete()
  .eq('id', noteId);

// AFTER (PocketBase)
await pb.collection('notes').delete(noteId);
```

### File Upload

```typescript
// BEFORE (Supabase)
const { data, error } = await supabase.storage
  .from('audiofiles')
  .upload(`${userId}/${fileName}`, file);

// AFTER (PocketBase)
const formData = new FormData();
formData.append('audio_file', file);
formData.append('user', userId);
const record = await pb.collection('notes').create(formData);
```

### Get File URL

```typescript
// BEFORE (Supabase)
const { data } = await supabase.storage
  .from('audiofiles')
  .createSignedUrl(filePath, 600);

// AFTER (PocketBase)
const url = pb.files.getUrl(record, record.audio_file);
// No expiration needed, uses collection rules
```

### Search/Filter

```typescript
// BEFORE (Supabase)
const { data, error } = await supabase
  .from('notes')
  .select('*')
  .ilike('chief_complaint', '%headache%');

// AFTER (PocketBase)
const records = await pb.collection('notes').getFullList({
  filter: `chief_complaint ~ "headache"`
});
```

### Real-time Subscriptions

```typescript
// BEFORE (Supabase)
const channel = supabase
  .channel('notes')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'notes' },
    (payload) => console.log(payload)
  )
  .subscribe();

// AFTER (PocketBase)
pb.collection('notes').subscribe('*', (e) => {
  console.log(e.action); // create, update, delete
  console.log(e.record);
});

// Unsubscribe
pb.collection('notes').unsubscribe('*');
```

## Key Differences

1. **No separate storage API** - Files are fields on records
2. **Relations use expand** - Similar to GraphQL
3. **Filter syntax** - Uses PocketBase filter language
4. **Auth is simpler** - Built into the client
5. **No RLS** - Use collection rules in admin UI

## Filter Operators

- `=` - Equal
- `!=` - Not equal
- `>` - Greater than
- `<` - Less than
- `~` - Like (case insensitive)
- `!~` - Not like
- `?=` - Array contains
- `&&` - AND
- `||` - OR

Example: `filter: 'status = "active" && created >= "2024-01-01"'`
