"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import axios from "../api/apiClient"
import Cookies from "js-cookie"
import { Users, FileText, Activity, Clock, UserPlus, FileUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

const DashboardPage: React.FC = () => {
  const [contactsCount, setContactsCount] = useState<number>(0)
  const [notesCount, setNotesCount] = useState<number>(0)
  const [latestContact, setLatestContact] = useState<string | null>(null)
  const [latestNote, setLatestNote] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const [sessionContactsCount, setSessionContactsCount] = useState<number>(
    Number(Cookies.get("sessionContactsCount")) || 0,
  )
  const [sessionNotesCount, setSessionNotesCount] = useState<number>(Number(Cookies.get("sessionNotesCount")) || 0)

  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch contacts
        const contactsResponse = await axios.get("/contacts")
        const contacts = contactsResponse.data
        setContactsCount(contacts.length)

        if (contacts.length > 0) {
          const latest = contacts[contacts.length - 1]
          setLatestContact(latest.name || "Unknown Contact")
        } else {
          setLatestContact("No contacts added yet")
        }

        // Fetch notes
        const notesResponse = await axios.get("/notes")
        const notes = notesResponse.data
        setNotesCount(notes.length)

        if (notes.length > 0) {
          const latestNoteData = notes[notes.length - 1]
          setLatestNote(latestNoteData.title || "Unknown Note")
        } else {
          setLatestNote("No notes added yet")
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (location.state?.contactAdded) {
      // Increase the session count when a contact is added
      const newCount = sessionContactsCount + 1
      setSessionContactsCount(newCount)
      Cookies.set("sessionContactsCount", String(newCount)) // Ensure it's saved in cookies
    }

    if (location.state?.noteAdded) {
      const newCount = sessionNotesCount + 1
      setSessionNotesCount(newCount)
      Cookies.set("sessionNotesCount", String(newCount))
    }

    // Clear navigation state after processing
    navigate(".", { replace: true, state: null })
  }, [location.state, sessionContactsCount, sessionNotesCount, navigate])

  const handleAddContact = () => {
    navigate("/contacts", { state: { showForm: true, contactAdded: true } })
  }

  const handleAddNote = () => {
    navigate("/notes", { state: { showForm: true } })
  }

  // Calculate total items and session progress
  const totalItems = contactsCount + notesCount
  const sessionItems = sessionContactsCount + sessionNotesCount
  const sessionProgress = totalItems > 0 ? (sessionItems / totalItems) * 100 : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your personal dashboard. Here's an overview of your data.</p>
      </div>

      {isLoading ? (
        <div className="flex h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-sm text-muted-foreground">Loading your data...</p>
          </div>
        </div>
      ) : error ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
          <h3 className="mb-2 text-lg font-medium text-destructive">Error Loading Data</h3>
          <p className="text-sm text-destructive/80">{error}</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      ) : (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{contactsCount}</div>
                  <p className="text-xs text-muted-foreground">{sessionContactsCount} added this session</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{notesCount}</div>
                  <p className="text-xs text-muted-foreground">{sessionNotesCount} added this session</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Session Activity</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{sessionItems} items</div>
                  <div className="mt-2">
                    <Progress value={sessionProgress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Add new items to your collection</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <Button onClick={handleAddContact} className="w-full justify-start" variant="outline">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add New Contact
                  </Button>
                  <Button onClick={handleAddNote} className="w-full justify-start" variant="outline">
                    <FileUp className="mr-2 h-4 w-4" />
                    Add New Note
                  </Button>
                </CardContent>
              </Card>

              <Card className="col-span-1 md:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest updates and additions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Latest Contact</p>
                      <p className="text-sm text-muted-foreground">{latestContact || "No contacts yet"}</p>
                    </div>
                    <div className="ml-auto font-medium">
                      {sessionContactsCount > 0 ? `+${sessionContactsCount}` : ""}
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Latest Note</p>
                      <p className="text-sm text-muted-foreground">{latestNote || "No notes yet"}</p>
                    </div>
                    <div className="ml-auto font-medium">{sessionNotesCount > 0 ? `+${sessionNotesCount}` : ""}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Usage Statistics</CardTitle>
                <CardDescription>Your data usage and activity over time</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Contacts Usage</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{contactsCount} total</span>
                  </div>
                  <Progress value={(contactsCount / (contactsCount + notesCount || 1)) * 100} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Notes Usage</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{notesCount} total</span>
                  </div>
                  <Progress value={(notesCount / (contactsCount + notesCount || 1)) * 100} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Session Activity</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{sessionItems} items</span>
                  </div>
                  <Progress value={sessionProgress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

export default DashboardPage

