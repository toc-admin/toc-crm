// Extract username from email (e.g., bruno@theofficecompany.eu -> Bruno)
export function getUsernameFromEmail(email: string): string {
  if (!email) return 'there'
  const username = email.split('@')[0]
  return username.charAt(0).toUpperCase() + username.slice(1)
}

// Random greetings with some fun easter eggs
export function getRandomGreeting(username: string): string {
  const time = new Date().getHours()

  const greetings = [
    // Time-based greetings
    ...(time < 12 ? [
      `Good morning, ${username}`,
      `Rise and shine, ${username}`,
      `Morning, ${username}`,
      `Top of the morning, ${username}`,
    ] : time < 18 ? [
      `Good afternoon, ${username}`,
      `Hey ${username}`,
      `Hello ${username}`,
      `Hi there, ${username}`,
    ] : [
      `Good evening, ${username}`,
      `Evening, ${username}`,
      `Hey ${username}`,
      `Hello ${username}`,
    ]),

    // General greetings
    `Welcome back, ${username}`,
    `Hey ${username}! 👋`,
    `What's up, ${username}?`,
    `Hello, ${username}!`,

    // Fun easter eggs (rare)
    ...(Math.random() < 0.05 ? [
      `${username}, you're looking great today!`,
      `Feeling productive, ${username}?`,
      `Let's crush it, ${username}!`,
      `You've got this, ${username}!`,
    ] : []),

    // Very rare special messages
    ...(Math.random() < 0.01 ? [
      `${username}, did you know furniture can't run? It has legs but no feet!`,
      `Fun fact ${username}: The word "furniture" comes from French "fourniture"`,
      `${username}, you're the best office manager ever!`,
      `Is it just me or is ${username} extra awesome today?`,
    ] : []),
  ]

  return greetings[Math.floor(Math.random() * greetings.length)]
}
