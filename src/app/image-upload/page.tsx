'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarLayout,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Layout, MessageSquare, Zap, Settings, Package2, Upload } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

import placeholderImageUrl from '@/public/threat.jpg'
import emergencyPlaceholderImageUrl from '@/public/emergency.jpg'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
async function describeImage(imageFile: File, prompt: string) {
  const url = `${BASE_URL}/describe`

  const formData = new FormData()
  formData.append('image', imageFile, 'image.jpg')
  formData.append('prompt', prompt)

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (!data.description || !data.image) {
      throw new Error('Invalid response format')
    }

    return {
      description: data.description['<MORE_DETAILED_CAPTION>'],
      image: data.image,
      threatLevel: Math.floor(Math.random() * 101) // Random number between 0 and 100
    }
  } catch (error) {
    console.error('Error describing image:', error)
    throw error
  }
}

// New component for animated text
const AnimatedText = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState('')

  useEffect(() => {
    let i = 0
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(prev => prev + text.charAt(i))
        i++
      } else {
        clearInterval(timer)
      }
    }, 20) // Adjust speed here

    return () => clearInterval(timer)
  }, [text])

  return (
    <Textarea
      value={displayText}
      readOnly
      className="w-full h-40"
    />
  )
}

const SeverityLevelBar = ({ level, type }: { level: number; type: 'threat' | 'emergency' }) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setProgress(level), 500)
    return () => clearTimeout(timer)
  }, [level])

  const getColorClass = (level: number) => {
    return level > 70 ? "bg-red-500" : "bg-green-500"
  }

  const getTextColorClass = (level: number) => {
    return level > 70 ? "text-red-500" : "text-green-500"
  }

  const getLabelText = (level: number, type: 'threat' | 'emergency') => {
    const severity = level > 70 ? "High" : "Low"
    return `${severity} ${type.charAt(0).toUpperCase() + type.slice(1)}`
  }

  return (
    <div className="w-full mt-4">
      <div className="flex justify-between mb-1">
        <span className="text-base font-medium text-primary">{type.charAt(0).toUpperCase() + type.slice(1)} Level</span>
        <span className={`text-sm font-medium ${getTextColorClass(progress)}`}>
          <b>{Math.round(progress)}% - {getLabelText(progress, type)}</b>
        </span>
      </div>
      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${getColorClass(progress)} transition-all duration-500 ease-out`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  )
}
export default function ImageUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isUploaded, setIsUploaded] = useState(false)
  const [description, setDescription] = useState<string | null>(null)
  const [emergencyDescription, setEmergencyDescription] = useState<string | null>(null)
  const [threatDescription, setThreatDescription] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [threatLevel, setThreatLevel] = useState<number>(0)
  const [emergencyLevel, setEmergencyLevel] = useState<number>(0)

  useEffect(() => {
    const sidebarState = localStorage.getItem("sidebar:state")
    setSidebarOpen(sidebarState === "true")
  }, [])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    setError(null)
    setIsUploaded(false)
    setDescription(null)

    if (selectedFile) {
      if (selectedFile.type === "image/jpeg" || selectedFile.type === "image/png") {
        setFile(selectedFile)
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string)
        }
        reader.readAsDataURL(selectedFile)
      } else {
        setError("Please select a JPEG or PNG image.")
        setFile(null)
        setPreviewUrl(null)
      }
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload.")
      return
    }
    
    setIsLoading(true)
    setError(null)
    
    try {
      const prompt = "Describe this image in detail" // You can customize this prompt
      const { description, image } = await describeImage(file, prompt)
      setDescription(description)
      setIsUploaded(true)
      setPreviewUrl(image) // The 'image' from the API is already in the correct format
    } catch (err) {
      console.log(err)
      setError('Failed to upload and describe image. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[1fr_auto_1fr]">
      <div className="hidden lg:block"></div>
      <div className="flex flex-col w-full lg:w-[1280px]">
        <header className="flex h-14 lg:h-[60px] items-center gap-3 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
          <h1 className="font-semibold text-lg">Image Upload and Description</h1>
        </header>
        <main className="flex-1 overflow-auto py-8">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="Threat Detection" className="w-full max-w-md mx-auto">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="Threat Detection">Threat Detection</TabsTrigger>
                <TabsTrigger value="Emergency Detection">Emergency Detection</TabsTrigger>
                <TabsTrigger value="Upload Image">Upload Image</TabsTrigger>
              </TabsList>
              <TabsContent value="Upload Image">
                <Card>
                  <CardHeader>
                    <CardTitle>{isUploaded ? "Image Description" : "Upload Image"}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Input
                        id="picture"
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={handleFileChange}
                      />
                    </div>
                    {error && (
                      <p className="text-sm text-red-500">{error}</p>
                    )}
                    {previewUrl && (
                      <div className="mt-4">
                        <img src={previewUrl} alt="Preview" className="max-w-full h-auto rounded-lg" />
                      </div>
                    )}
                    {description && (
                      <div className="mt-4">
                        <h3 className="font-semibold mb-2">Image Description:</h3>
                        <AnimatedText text={description} />
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={handleUpload} 
                      className="w-full" 
                      disabled={!file || isLoading}
                    >
                      {isLoading ? 'Processing...' : (isUploaded ? 'Upload Another' : 'Upload and Describe')}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="Emergency Detection">
                <Card>
                  <CardHeader>
                    <CardTitle>Emergency Detection</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <img 
                        src={emergencyPlaceholderImageUrl.src}
                        alt="Emergency Detection Placeholder" 
                        className="max-w-full h-auto rounded-lg mb-4"
                      />
                      <Button 
                        onClick={() => {
                          fetch(emergencyPlaceholderImageUrl.src)
                            .then(res => res.blob())
                            .then(blob => {
                              setIsLoading(true);
                              return describeImage(new File([blob], 'placeholder-emergency.jpg'), '');
                            })
                            .then(result => {
                              setEmergencyDescription(result.description);
                              setProcessedImageUrl(result.image);
                              setEmergencyLevel(Math.floor(Math.random() * 101));
                              setIsLoading(false);
                              // Overwrite the image with the processed image from the response
                              const img = document.querySelector('img[alt="Emergency Detection Placeholder"]') as HTMLImageElement;
                              if (img) {
                                img.src = result.image;
                              }
                            })
                            .catch(error => {
                              setError('Error analyzing emergency: ' + error.message);
                              setIsLoading(false);
                            })
                        }} 
                        className="w-full"
                      >
                        Analyze Emergency
                      </Button>
                    {emergencyDescription && (
                      <div className="mt-4">
                        <h3 className="font-semibold mb-2">Emergency Analysis:</h3>
                        <AnimatedText text={emergencyDescription} />
                        <SeverityLevelBar level={emergencyLevel} type="emergency" />
                      </div>
                    )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="Threat Detection">
                <Card>
                  <CardHeader>
                    <CardTitle>Threat Detection</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <img 
                        src={placeholderImageUrl.src}
                        alt="Threat Detection Placeholder" 
                        className="max-w-full h-auto rounded-lg mb-4"
                      />
                      <Button 
                        onClick={() => {
                          fetch(placeholderImageUrl.src)
                            .then(res => res.blob())
                            .then(blob => {
                              setIsLoading(true);
                              return describeImage(new File([blob], 'placeholder-threat.jpg'), '');
                            })
                            .then(result => {
                              setThreatDescription(result.description);
                              setProcessedImageUrl(result.image);
                              setThreatLevel(Math.floor(Math.random() * 101));
                              setIsLoading(false);
                              // Overwrite the image with the processed image from the response
                              const img = document.querySelector('img[alt="Threat Detection Placeholder"]') as HTMLImageElement;
                              if (img) {
                                img.src = result.image;
                              }
                            })
                            .catch(error => {
                              setError('Error analyzing threat: ' + error.message);
                              setIsLoading(false);
                            })
                        }} 
                        className="w-full"
                      >
                        Analyze Threat
                      </Button>
                    {threatDescription && (
                      <div className="mt-4">
                        <h3 className="font-semibold mb-2">Threat Analysis:</h3>
                        <AnimatedText text={threatDescription} />
                        <SeverityLevelBar level={threatLevel} type="threat" />
                      </div>
                    )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
      <div className="hidden lg:block"></div>
    </div>
  )
}