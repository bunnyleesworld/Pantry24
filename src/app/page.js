"use client"
import { Box, Button, Modal, Stack, TextField, Typography, Card, CardContent, IconButton, Paper } from '@mui/material'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import InventoryTwoToneIcon from '@mui/icons-material/InventoryTwoTone';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import BakeryDiningOutlinedIcon from '@mui/icons-material/BakeryDiningOutlined';
import { Add, Remove } from '@mui/icons-material'
import { useState, useEffect } from 'react'
import { firestore } from './firebase'
import { collection, deleteDoc, doc, getDocs, setDoc, getDoc, query } from 'firebase/firestore'



// Inventory Item Component
const InventoryItem = ({ name, quantity, onRemove, onAdd, onDelete }) => (
  <Card sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1, mb: 2 }}>
    <CardContent>
      <Typography variant="h5" component="div">
        {name.charAt(0).toUpperCase() + name.slice(1)}
      </Typography>
      <Typography variant="h6" color="text.secondary">
        Quantity: {quantity !== undefined ? quantity : 'N/A'}
      </Typography>
    </CardContent>
    <Stack direction={"row"} spacing={2}>
      <IconButton
        sx={{ color: " #5B7C99" }}
        aria-label="Add item"
        onClick={() => onAdd(name)}>
        <AddCircleIcon />
      </IconButton>
      <IconButton
        sx={{ color: "#FF6961" }}
        aria-label="remove item"
        onClick={() => onRemove(name)}>
        <RemoveCircleOutlineIcon />
      </IconButton>
      <IconButton
        sx={{ color: "#FF6961" }}
        aria-label="delete item"
        onClick={() => onDelete(name)}>
        <DeleteForeverIcon/>
      </IconButton>
    </Stack>
  </Card>
)

// Main Component
export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch inventory from Firestore
  const updateInventory = async () => {
    try {
      const snapshot = query(collection(firestore, 'inventory'))
      const docs = await getDocs(snapshot)
      const inventoryList = docs.docs.map((doc) => ({
        name: doc.id,
        ...doc.data(),
      }))
      console.log('Inventory List:', inventoryList) 

      // Sorting items
      inventoryList.sort((a, b) => a.name.localeCompare(b.name))

      setInventory(inventoryList)
    } catch (error) {
      console.error('Error updating inventory:', error)
    }
  }

  // Add item 
  const addItem = async (item) => {
    try {
      const docRef = doc(collection(firestore, 'inventory'), item)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const { quantity } = docSnap.data()
        await setDoc(docRef, { quantity: quantity + 1 }, { merge: true })
      } else {
        await setDoc(docRef, { quantity: 1 }, { merge: true })
      }
      await updateInventory()
    } catch (error) {
      console.error('Error adding item:', error)
    }
  }

  // Remove item 
  const removeItem = async (item) => {
    try {
      const docRef = doc(collection(firestore, 'inventory'), item)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const { quantity } = docSnap.data()
        if (quantity === 1) {
          await deleteDoc(docRef)
        } else {
          await setDoc(docRef, { quantity: quantity - 1 }, { merge: true })
        }
      }
      await updateInventory()
    } catch (error) {
      console.error('Error removing item:', error)
    }
  }

  // Delete item
  const deleteItem = async (item) => {
    try {
      const docRef = doc(collection(firestore, 'inventory'), item)
      await deleteDoc(docRef)
      await updateInventory()
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      flexDirection="column"
      alignItems="center"
      gap={2}
      bgcolor={"#f9f2eb"}
    >
      
      <Box 
      padding="3"  
      display="flex"
      justifyContent="center"
      flexDirection="column"
      alignItems="center"
      
      >
         <Typography variant="h2" color={'#5B7C99'} mt={4}>
            Welcome to Easy Pantry
          </Typography>
        
        <Typography variant='h6' color="#5B7C99" alignItems={'center'} >
          Here you can keep track of your pantry items<br></br>
          Add Items, Remove Items, and Delete items
        </Typography>
        <Typography variant='h6' color="#5B7C99" alignItems={'center'}>
          All in one place
        </Typography>
        <Typography  color='#FF6961'>
        <BakeryDiningOutlinedIcon sx={{fontSize: 40}}/>
        </Typography>
      </Box>
      {/* Modal for adding items */}
      <Modal open={open} onClose={handleClose}>
        <Paper
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 400,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Typography variant='h6'>Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2} >
            <TextField
              variant='outlined'
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              sx={{
                bgcolor: " #5B7C99",
                ':hover': { bgcolor: "#FFD1DC", color: "#5B7C99" }
              }}
              variant='contained'
              startIcon={<Add />}
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
        </Paper>
      </Modal>

      <Box
      sx={{
        padding: 5
      }}
      >
      <Button
        sx={{
          color: " #e75480",
          bgcolor: "#FFD1DC",
          ':hover': { bgcolor: '#e75480', color: "white" }
        }}
        variant='contained'
        onClick={handleOpen}>
        Add New Item
      </Button>
      </Box>

      

      <Box border="1px solid #333" width="80%" overflow={'auto'} mb={10}>
        <Box
          width="100%"
          height="100px"
          bgcolor="#FFD1DC"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant='h2' color="#5B7C99" padding={6}>
           <InventoryTwoToneIcon sx={{fontSize: 40}}/> Inventory Items
          </Typography>
           <TextField
            variant='outlined'
            placeholder='Search items...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: '40%'}}
          />
        </Box>
      

      <Stack width="100%" height="100vh" spacing={2} overflow={"auto"}>
        {filteredInventory.map(({ name, quantity }) => (
          <InventoryItem
            key={name}
            name={name}
            quantity={quantity}
            onAdd={addItem}
            onRemove={removeItem}
            onDelete={deleteItem}
          />
        ))}
      </Stack>
      </Box>
      <Box mb={2} color={'#e75480'}>
        <Typography>
          Project made by Bunny lee
        </Typography>
      </Box>
    </Box>
    
  )
}









