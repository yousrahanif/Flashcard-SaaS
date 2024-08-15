'use client'

import { useState } from 'react'
import { db } from '@/firebase'
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  CardContent,
  Card,
  Grid,
  CardActionArea,
  DialogActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from '@mui/material'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { doc, collection, setDoc, getDoc, writeBatch } from 'firebase/firestore'

export default function Generate() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [text, setText] = useState('')
  const [flashcards, setFlashcards] = useState([])
  const [flipped, setFlipped] = useState({})
  const [setName, setSetName] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const router = useRouter()

  const handleSubmit = async () => {
    fetch('api/generate', {
      method: 'POST',
      body: text,
    })
      .then((res) => res.json())
      .then((data) => setFlashcards(data))
  }

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleOpen = () => {
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
  }

  const saveFlashcards = async () => {
    if (!setName.trim()) {
      alert('Please enter a name for your flashcard set.')
      return
    }

    const batch = writeBatch(db)
    const userDocRef = doc(collection(db, 'users'), user.id)
    const docSnap = await getDoc(userDocRef)

    if (docSnap.exists()) {
      const collections = docSnap.data().flashcards || []
      if (collections.find((f) => f.name === setName)) {
        alert('A flashcard collection with the same name already exists')
        return
      } else {
        collections.push({ name: setName })
        batch.set(userDocRef, { flashcards: collections }, { merge: true })
      }
    } else {
      batch.set(userDocRef, { flashcards: [{ name: setName }] })
    }

    const colRef = collection(userDocRef, setName)
    flashcards.forEach((flashcard) => {
      const cardDocRef = doc(colRef)
      batch.set(cardDocRef, flashcard)
    })

    await batch.commit()
    handleCloseDialog()
    router.push('/flashcards')
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 6, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Typography variant="h4">Generate Flashcards</Typography>
        <Paper sx={{ p: 4, width: '100%' }}>
          <TextField
            value={text}
            onChange={(e) => setText(e.target.value)}
            label="Enter Text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
            Submit
          </Button>
        </Paper>
      </Box>
      {flashcards.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5">Flashcards Preview</Typography>
          <Grid container spacing={2}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardActionArea onClick={() => handleCardClick(index)}>
                    <CardContent>
                      <Box
                        sx={{
                          perspective: '100px',
                          '& > div': {
                            transition: 'transform 0.6s',
                            transformStyle: 'preserve-3d',
                            position: 'relative',
                            width: '100%',
                            height: '200px',
                            boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                            transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                          },
                          '& > div > div': {
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            backfaceVisibility: 'hidden',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 2,
                            boxSizing: 'border-box',
                          },
                          '& > div > div:nth-of-type(2)': {
                            transform: 'rotateY(180deg)',
                          },
                        }}
                      >
                        <div>
                          <div>
                            <Typography variant="h5" component="div">
                              {flashcard.front}
                            </Typography>
                          </div>
                          <div>
                            <Typography variant="h5" component="div">
                              {flashcard.back}
                            </Typography>
                          </div>
                        </div>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button variant="contained" color="secondary" onClick={handleOpen}>
              Save
            </Button>
          </Box>
        </Box>
      )}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Save Flashcard Set</DialogTitle>
        <DialogContent>
          <DialogContentText>Please enter a name for your flashcard set.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Set Name"
            type="text"
            fullWidth
            value={setName}
            onChange={(e) => setSetName(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={saveFlashcards} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}



// 'use client'

// import { useState } from 'react'
// import { db } from '@/firebase'
// import {
//   Container,
//   TextField,
//   Button,
//   Typography,
//   Box,
//   Paper,
//   CardContent,
//   Card,
//   Grid,
//   CardActionArea,
//   DialogActions,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogContentText,
// } from '@mui/material'
// import { useRouter } from 'next/navigation'
// import { useUser } from '@clerk/nextjs'
// import { doc, collection, setDoc, getDoc, writeBatch  } from 'firebase/firestore'


// export default function Generate() {
//     const { isLoaded, isSignedIn, user } = useUser()
//   const [text, setText] = useState('')
//   const [flashcards, setFlashcards] = useState([])
//   const [flipped, setFlipped] = useState({})
//   const [setName, setSetName] = useState('')
// const [dialogOpen, setDialogOpen] = useState(false)
// const router =useRouter
  

// const handleSubmit = async () => {
//      fetch('api/generate', {
//       method: 'POST',
//       body:text,
     
//     })
//     .then((res)=>res.json())
//     .then((data) => setFlashcards(data))
//   }
// const handleCardClick=(id)=>{
//   setFlipped((prev)=>({
//     ...prev,
//     [id]:!prev[id],
//   }))
// }
//  const handleOpen=()=>{
//   setDialogOpen(true)

//  }
//  const handleCloseDialog=()=>{
//   setDialogOpen(false)

//  }
//  const saveFlashcards = async () => {
//   if (!setName.trim()) {
//     alert('Please enter a name for your flashcard set.')
//     return
//   }

 

//     const batch = writeBatch(db)
//     const userDocRef=doc(collection(db, 'users'), user.id)
//     const docSnap=await getDoc(userDocRef)

//     if (docSnap.exists()) {
//       const collections = docSnap.data().flashcards ||[]
//       if (collections.find((f)=>f.name===setName)){
//         alert('Flashcards collection with the same name already exists')
//         return 

//       }
//       else{
//         collection.push({setName})
//         batch.set(userDocRef,{flashcards:collections}, {merge:true})
//       }
//     }
//     else{
//       batch.set(userDocRef,{flashcards:[{setName}]})
//     }
//     const colRef= collection(userDocRef,setName)
//     flashcards.forEach((flashcard)=>{
//       const cardDocRef= doc(colRef)
//       batch.set(cardDocRef, flashcard)
//     })
//     await batch.commit()
//     handleCloseDialog()
//     router.push('/flashcards')
  
//   } 
// return <Container maxWidth="md">
// <Box sx={{ mt: 4, mb:6, display: 'flex', flexDirection:'column', justifyContent: 'center' }}>
//    <Typography variant='h4'>Generate Flashcards</Typography>
//    <Paper sx={{p:4, width:'100%'}}>
//     <TextField value={text}
//     onChange={(e)=>setText(e.target.value)}
//     label ="Enter Text" fullWidth multiline rows={4} variant="outlined" sx={{mb:2,}}></TextField>
//     <Button variant='contained' color='primary' onClick={handleSubmit} fullWidth >Submit</Button>
//    </Paper>
//   </Box>
//   {flashcards.length > 0 && (
//   <Box sx={{ mt: 4 }}>
//     <Typography variant="h5" >
//        Flashcards Preview
//     </Typography>
//     <Grid container spacing={2}>
//       {flashcards.map((flashcard, index) => (
//         <Grid item xs={12} sm={6} md={4} key={index}>
//        <Card>
//         <CardActionArea onClick={()=>{
//           handleCardClick(index)
//         }}>
// <CardContent>
//   <Box sx={{perspective:'100px', 
//   '& > div':{
//     transition:'transform 0.6s',
//     transformStyle:'preserve-3d', 
//     position:'relative',
//     width:'100%',
//     height:'200px',
//     boxShadow:'0 4px 8px 0 rgba (0,0,0,0.2)',
//     transform:flipped[index]? 'rotateY(180deg)':'rotateY(0deg)'
//   },
//   '& > div > div':{
//    position:'absolute',
//     width:'100%',
//     height:'100%',
//     backfaceVisibility:'hidden',
//     display:"flex",
//     justifyContent:'center', 
//     alignItems:'center', 
//     padding:2,
//     boxSizing:'border-box',
//   },
//   '& > div > div:nth-of-type(2)':{
//     transform:'rotateY(180deg)'
//   }
    
//   }}
  
  
  
  
//   >
//     <div> 
    
//       <div> <Typography variant='h5' component="div">{flashcard.front}</Typography> </div> 
//       <div> <Typography variant='h5' component="div">{flashcard.back}</Typography> </div> 
//     </div>
//   </Box>

// </CardContent>
//         </CardActionArea>
//        </Card>
//         </Grid>
//       ))}
//     </Grid>

//     <Box sx={{mt:4, display:'flex', justifyContent:'center'}}>
//       <Button variant='contained' color='secondary' onClick={handleOpen}>Save</Button>

//     </Box>
//   </Box>
// )}
// <Dialog open={dialogOpen} onClose={handleCloseDialog}>
//   <DialogTitle>Save Flashcard Set</DialogTitle>
//   <DialogContent>
//     <DialogContentText>
//       Please enter a name for your flashcard set.
//     </DialogContentText>
//     <TextField
//       autoFocus
//       margin="dense"
//       label="Set Name"
//       type="text"
//       fullWidth
//       value={setName}
//       onChange={(e) => setSetName(e.target.value)}
//       variant='outlined'
//     />
//   </DialogContent>
//   <DialogActions>
//     <Button onClick={handleCloseDialog}>Cancel</Button>
//     <Button onClick={saveFlashcards} color="primary">
//       Save
//     </Button>
//   </DialogActions>
// </Dialog>
// </Container>
// }