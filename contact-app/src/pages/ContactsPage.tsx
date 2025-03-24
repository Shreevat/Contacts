"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/apiClient";
import Cookies from "js-cookie";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  Pencil,
  Trash2,
  ArrowLeftCircle,
  Plus,
  UserPlus,
  Save,
  X,
  Mail,
  Phone,
  User,
} from "lucide-react";

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  createdAt?: string;
  updatedAt?: string;
}

const ContactsPage: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContacts = async () => {
      const token = Cookies.get("authToken");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const response = await axios.get("/contacts");
        setContacts(response.data);
      } catch {
        console.error("Error fetching contacts");
      } finally {
        setIsLoading(false);
      }
    };
    fetchContacts();
  }, [navigate]);

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingContact) {
        const response = await axios.put(
          `/contacts/${editingContact._id}`,
          newContact
        );
        setContacts((prev) =>
          prev.map((c) => (c._id === editingContact._id ? response.data : c))
        );
        setEditingContact(null);
      } else {
        const response = await axios.post("/contacts", newContact);
        setContacts((prev) => [...prev, response.data]);
      }
      setNewContact({ name: "", email: "", phone: "" });
      setIsDialogOpen(false);
    } catch {
      console.error("Error saving contact");
    }
  };

  const handleDeleteContact = async (id: string) => {
    try {
      await axios.delete(`/contacts/${id}`);
      setContacts((prev) => prev.filter((c) => c._id !== id));
    } catch {
      console.error("Error deleting contact");
    }
  };

  const openEditDialog = (contact: Contact) => {
    setEditingContact(contact);
    setNewContact({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
    });
    setIsDialogOpen(true);
  };

  const openNewContactDialog = () => {
    setEditingContact(null);
    setNewContact({ name: "", email: "", phone: "" });
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingContact(null);
    setNewContact({ name: "", email: "", phone: "" });
  };

  const formatDate = (date?: string) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
          <p className="text-muted-foreground mt-1">
            Manage your personal contacts
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate("/oldcontactspage")}
          >
            <ArrowLeftCircle className="mr-2 h-4 w-4" /> Old Contacts
          </Button>
          <Button onClick={openNewContactDialog}>
            <Plus className="mr-2 h-4 w-4" /> New Contact
          </Button>
        </div>
      </div>

      <Tabs
        defaultValue="all"
        className="mb-8"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList>
          <TabsTrigger value="all">All Contacts</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : contacts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <UserPlus className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No contacts yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first contact to get started
              </p>
              <Button onClick={openNewContactDialog}>
                <Plus className="mr-2 h-4 w-4" /> Create Contact
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {contacts.map((contact) => (
                <Card
                  key={contact._id}
                  className="overflow-hidden hover:shadow-md transition-shadow"
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="line-clamp-1 flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      {contact.name}
                    </CardTitle>
                    <CardDescription className="flex items-center text-xs">
                      {contact.createdAt &&
                        `Added: ${formatDate(contact.createdAt)}`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2 space-y-2">
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {contact.email}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {contact.phone}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(contact)}
                    >
                      <Pencil className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeleteContact(contact._id)}
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
              {[...contacts]
                .sort((a, b) => {
                  if (!a.createdAt || !b.createdAt) return 0;
                  return (
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                  );
                })
                .slice(0, 6)
                .map((contact) => (
                  <Card
                    key={contact._id}
                    className="overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="line-clamp-1 flex items-center">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        {contact.name}
                      </CardTitle>
                      <CardDescription className="flex items-center text-xs">
                        {contact.createdAt &&
                          `Added: ${formatDate(contact.createdAt)}`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2 space-y-2">
                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {contact.email}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {contact.phone}
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(contact)}
                      >
                        <Pencil className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteContact(contact._id)}
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
            <DialogTitle>
              {editingContact ? "Edit Contact" : "Create New Contact"}
            </DialogTitle>
            <DialogDescription>
              {editingContact
                ? "Update your contact details below."
                : "Add a new contact to your collection."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveContact} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Contact name"
                value={newContact.name}
                onChange={(e) =>
                  setNewContact({ ...newContact, name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email address"
                value={newContact.email}
                onChange={(e) =>
                  setNewContact({ ...newContact, email: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="Phone number"
                value={newContact.phone}
                onChange={(e) =>
                  setNewContact({ ...newContact, phone: e.target.value })
                }
                required
              />
            </div>
            <DialogFooter className="flex justify-between sm:justify-between">
              <Button type="button" variant="outline" onClick={closeDialog}>
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />{" "}
                {editingContact ? "Update Contact" : "Save Contact"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactsPage;
