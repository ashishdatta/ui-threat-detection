'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Layout, MessageSquare, Zap, Settings, Package2, Upload } from 'lucide-react'
import Sidebar from '@/components/ui/sidebar'
const backgrounds = ['Forest', 'City', 'Desert', 'Mountain']
const races = ['Human', 'Elf', 'Dwarf', 'Orc']
const weapons = ['Sword', 'Bow', 'Axe', 'Staff']

export default function CharacterGenerator() {
  const [background, setBackground] = useState('')
  const [race, setRace] = useState('')
  const [weapon, setWeapon] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    setIsLoading(true)
    setError('')
    setImageUrl('')

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ background, race, weapon }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate image')
      }

      const data = await response.json()
      
      // Poll for the result
      const pollInterval = setInterval(async () => {
        const pollResponse = await fetch(`https://api.replicate.com/v1/predictions/${data.id}`, {
          headers: {
            Authorization: `Token ${process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN}`,
          },
        })
        const pollData = await pollResponse.json()
        
        if (pollData.status === 'succeeded') {
          clearInterval(pollInterval)
          setImageUrl(pollData.output[0])
          setIsLoading(false)
        } else if (pollData.status === 'failed') {
          clearInterval(pollInterval)
          setError('Image generation failed')
          setIsLoading(false)
        }
      }, 1000)
    } catch (err) {
      setError('Failed to generate image')
      setIsLoading(false)
    }
  }

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
          <h1 className="font-semibold text-lg">Character Generator</h1>
        </header>
        <main className="flex-1 overflow-auto py-8">
          <div className="container mx-auto px-4">
            <Card className="w-full max-w-md mx-auto">
              <CardHeader>
                <CardTitle>Generate Your Character</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select onValueChange={setBackground}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select background" />
                  </SelectTrigger>
                  <SelectContent>
                    {backgrounds.map((bg) => (
                      <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select onValueChange={setRace}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select race" />
                  </SelectTrigger>
                  <SelectContent>
                    {races.map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select onValueChange={setWeapon}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select weapon" />
                  </SelectTrigger>
                  <SelectContent>
                    {weapons.map((w) => (
                      <SelectItem key={w} value={w}>{w}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
              <CardFooter>
                <Button onClick={handleGenerate} className="w-full" disabled={isLoading || !background || !race || !weapon}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate'
                  )}
                </Button>
              </CardFooter>
            </Card>

            {error && (
              <Card className="mt-8 w-full max-w-md mx-auto bg-red-50">
                <CardContent className="p-4">
                  <p className="text-red-500">{error}</p>
                </CardContent>
              </Card>
            )}

            {imageUrl && (
              <Card className="mt-8 w-full max-w-md mx-auto">
                <CardHeader>
                  <CardTitle>Generated Character</CardTitle>
                </CardHeader>
                <CardContent>
                  <img src={imageUrl} alt="Generated character" className="w-full h-auto" />
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}