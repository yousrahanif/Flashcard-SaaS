'use client'

import getStripe from '@/utils/get-stripe'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { useState } from 'react'
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  AppBar,
  Toolbar,
  Grid,
} from '@mui/material'
import Head from 'next/head'

export default function Home() {
  const [text, setText] = useState('')
  const [flashcards, setFlashcards] = useState([])

  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_session', {
      method: 'POST',
      headers: { origin: 'http://localhost:3000'},
    })
    const checkoutSessionJson = await checkoutSession.json()
    if (checkoutSession.statusCode==500){
      console.error(checkoutSession.message)
      return 
    }
  
    const stripe = await getStripe()
    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    })
  
    if (error) {
      console.warn(error.message)
    }
  }

  return (
    <Container maxWidth="md">
      <Head>
        <title>
          Flashcard SaaS
        </title>
        <meta name="description" content='Create flashcard from your text'></meta>

      </Head>
      <AppBar position="static">
  <Toolbar>
    <Typography variant="h6" style={{flexGrow: 1}}>
      Flashcard SaaS
    </Typography>
    <SignedOut>
      <Button color="inherit" href="/sign-in">Login</Button>
      <Button color="inherit" href="/sign-up">Sign Up</Button>
    </SignedOut>
    <SignedIn>
      <UserButton />
    </SignedIn>
  </Toolbar>
</AppBar>
<Box sx={{textAlign: 'center', my: 4}}>
  <Typography variant="h2" component="h1" gutterBottom>
    Welcome to Flashcard SaaS
  </Typography>
  <Typography variant="h5" component="h2" gutterBottom>
    The easiest way to create flashcards from your text.
  </Typography>
  <Button variant="contained" color="primary" sx={{mt: 2, mr: 2}} href="/generate">
    Get Started
  </Button>
  <Button variant="outlined" color="primary" sx={{mt: 2}}>
    Learn More
  </Button>
</Box>
<Box sx={{ my: 6, textAlign: 'center' }}>
  <Typography variant="h4" component="h2" gutterBottom>Features</Typography>
  <Grid container spacing={4}>
    {/* Feature 1 */}
    <Grid item xs={12} md={4}>
      <Box sx={{ p: 3, border: '1px solid', borderColor: 'grey.300', borderRadius: 2 }}>
        <Typography variant='h6' gutterBottom>
          Effortless Text Conversion
        </Typography>
        <Typography variant='body1'>
          Transform your text into flashcards effortlessly. Our intuitive interface ensures a smooth experience, making card creation quick and easy.
        </Typography>
      </Box>
    </Grid>

    {/* Feature 2 */}
    <Grid item xs={12} md={4}>
      <Box sx={{ p: 3, border: '1px solid', borderColor: 'grey.300', borderRadius: 2 }}>
        <Typography variant='h6' gutterBottom>
          Intelligent Categorization
        </Typography>
        <Typography variant='body1'>
          Automatically categorize your flashcards based on content, helping you stay organized and focused on the most important topics.
        </Typography>
      </Box>
    </Grid>

    {/* Feature 3 */}
    <Grid item xs={12} md={4}>
      <Box sx={{ p: 3, border: '1px solid', borderColor: 'grey.300', borderRadius: 2 }}>
        <Typography variant='h6' gutterBottom>
          Customizable Templates
        </Typography>
        <Typography variant='body1'>
  Personalize your flashcards with a range of customizable templates. Whether you prefer a minimalist design or a more elaborate style, we&apos;ve got you covered.
</Typography>
      </Box>
    </Grid>
  </Grid>
</Box>


<Box sx={{ my: 6, textAlign: 'center' }}>
  <Typography variant="h4" component="h2" gutterBottom>Pricing</Typography>
  <Grid container spacing={4}>
    {/* Basic Pricing */}
    <Grid item xs={12} md={6}>
      <Box sx={{ p: 3, border: '1px solid', borderColor: 'grey.300', borderRadius: 2 }}>
        <Typography variant='h5' gutterBottom>
          Basic
        </Typography>
        <Typography variant='h6' gutterBottom>
          $5 / Month
        </Typography>
        <Typography variant='h6'>
          Access to Basic Card Features. Perfect for individuals just getting started with flashcards.
        </Typography>
        <Button variant='contained' color='primary' sx={{ mt: 2 }} onClick={handleSubmit}>Choose Basic</Button>
      </Box>
    </Grid>

    {/* Pro Pricing */}
    <Grid item xs={12} md={6}>
      <Box sx={{ p: 3, border: '1px solid', borderColor: 'grey.300', borderRadius: 2 }}>
        <Typography variant='h5' gutterBottom>
          Pro
        </Typography>
        <Typography variant='h6' gutterBottom>
          $10 / Month
        </Typography>
        <Typography variant='h6'>
          Access to Advanced Card Features and Priority Support. Ideal for power users and teams.
        </Typography>
        <Button variant='contained' color='primary' sx={{ mt: 2 }} onClick={handleSubmit}>Choose Pro</Button>
      </Box>
    </Grid>
  </Grid>
</Box>

      
     
    </Container>
  )
}