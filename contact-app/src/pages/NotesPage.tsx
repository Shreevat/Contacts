"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "../api/apiClient"
import Cookies from "js-cookie"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Pencil, Trash2, ArrowLeftCircle, Plus, FileText, Save, X } from "lucide-react"

interface Note {
  _id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

const NotesPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [newNote, setNewNote] = useState({ title: "", content: "" })
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchNotes = async () => {
      const token = Cookies.get("authToken")
      if (!token) {
        navigate("/login")
        return
      }
      try {
        const response = await axios.get("/notes")
        setNotes(response.data)
      } catch {
        console.error("Error fetching notes")
      } finally {
        setIsLoading(false)
      }
    }
    fetchNotes()
  }, [navigate])

  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingNote) {
        const response = await axios.put(`/notes/${editingNote._id}`, newNote)
        setNotes((prev) => prev.map((n) => (n._id === editingNote._id ? response.data : n)))
        setEditingNote(null)
      } else {
        const response = await axios.post("/notes", newNote)
        setNotes((prev) => [...prev, response.data])
      }
      setNewNote({ title: "", content: "" })
      setIsDialogOpen(false)
    } catch {
      console.error("Error saving note")
    }
  }

  const handleDeleteNote = async (id: string) => {
    try {
      await axios.delete(`/notes/${id}`)
      setNotes((prev) => prev.filter((n) => n._id !== id))
    } catch {
      console.error("Error deleting note")
    }
  }

  const openEditDialog = (note: Note) => {
    setEditingNote(note)
    setNewNote({ title: note.title, content: note.content })
    setIsDialogOpen(true)
  }

  const openNewNoteDialog = () => {
    setEditingNote(null)
    setNewNote({ title: "", content: "" })
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setEditingNote(null)
    setNewNote({ title: "", content: "" })
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notes</h1>
          <p className="text-muted-foreground mt-1">Manage your personal notes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/oldnotespage")}>
            <ArrowLeftCircle className="mr-2 h-4 w-4" /> Old Notes
          </Button>
          <Button onClick={openNewNoteDialog}>
            <Plus className="mr-2 h-4 w-4" /> New Note
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-8" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Notes</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No notes yet</h3>
              <p className="text-muted-foreground mb-4">Create your first note to get started</p>
              <Button onClick={openNewNoteDialog}>
                <Plus className="mr-2 h-4 w-4" /> Create Note
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {notes.map((note) => (
                <Card key={note._id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="line-clamp-1">{note.title}</CardTitle>
                    <CardDescription className="flex items-center text-xs">
                      Created: {formatDate(note.createdAt)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <ScrollArea className="h-24">
                      <p className="text-sm text-muted-foreground whitespace-pre-line">{note.content}</p>
                    </ScrollArea>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2 border-t">
                    <Button variant="ghost" size="sm" onClick={() => openEditDialog(note)}>
                      <Pencil className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeleteNote(note._id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="recent">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...notes]
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 6)
                .map((note) => (
                  <Card key={note._id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="line-clamp-1">{note.title}</CardTitle>
                      <CardDescription className="flex items-center text-xs">
                        Created: {formatDate(note.createdAt)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <ScrollArea className="h-24">
                        <p className="text-sm text-muted-foreground whitespace-pre-line">{note.content}</p>
                      </ScrollArea>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2 border-t">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(note)}>
                        <Pencil className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteNote(note._id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingNote ? "Edit Note" : "Create New Note"}</DialogTitle>
            <DialogDescription>
              {editingNote ? "Update your note details below." : "Add a new note to your collection."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveNote} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Note title"
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Write your note here..."
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                required
                className="min-h-[150px]"
              />
            </div>
            <DialogFooter className="flex justify-between sm:justify-between">
              <Button type="button" variant="outline" onClick={closeDialog}>
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" /> {editingNote ? "Update Note" : "Save Note"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default NotesPage

