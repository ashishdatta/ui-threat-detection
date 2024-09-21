import { Bell, ChevronDown, Layout, MessageSquare, Plus, Settings, Zap, Upload } from "lucide-react"
import Link from 'next/link'
import { Button } from "@/components/ui/button"
//import { AppSidebar } from '@/components/app-sidebar'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"

export default function Component() {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <div className="flex flex-col">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-[280px] justify-start text-left font-normal" variant="outline">
                <span>My custom chatbot</span>
                <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[280px]">
              <DropdownMenuItem>My custom chatbot</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="icon" variant="outline">
            <Plus className="h-4 w-4" />
            <span className="sr-only">Create a new chatbot</span>
          </Button>
          <div className="ml-auto flex items-center gap-4">
            <Button size="icon" variant="ghost">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">6</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Messages / Conversation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>What's next ?</CardTitle>
              <CardDescription>Follow these steps to set up your chatbot</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white">
                  ✓
                </div>
                <div>Create your chatbot</div>
              </div>
              <Separator />
              <div className="flex items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white">
                  ✓
                </div>
                <div>Add some sources to begin the training</div>
              </div>
              <Separator />
              <div className="flex items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white">
                  ✓
                </div>
                <div>Configure and customize the appearance of your chatbot</div>
              </div>
              <Separator />
              <div className="flex items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white">
                  ✓
                </div>
                <div>Test your chatbot in private</div>
              </div>
              <Separator />
              <div className="flex items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-600">
                  5
                </div>
                <div>Embed your chatbot on your website</div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
