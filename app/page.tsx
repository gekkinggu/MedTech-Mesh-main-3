"use client";

import * as React from "react";
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/lib/store'
import { setRecentModels, setPopularModels, setOtherModels, setCurrentModel, setLoading } from '@/lib/features/models/modelsSlice'
import { useRouter } from 'next/navigation'
import { Navbar } from "@/components/navbar";
import { ModelGrid } from "@/components/model-grid";
import { InfiniteModelGrid } from "@/components/infinite-model-grid";
import { SearchModelGrid } from "@/components/search-model-grid";
import { ModelGridSkeleton } from "@/components/skeletons/model-grid-skeleton";
import { Footer } from "@/components/footer";

// Manual model data
const manualModels = [
  {
    id: "model-1",
    title: "TANGAN KEREN",
    author: "Kel. 6 Website",
    username: "@drsmith",
    downloads: 120,
    likes: 85,
    imageUrl: "/image1.jpg",
    category: "3D Models",
    shares: 100,
    description: "Dari Kelompok 6 - Website. Kami menemukan ide untuk model ini saat kami bertemu dengan John Tangan, ahli tangan dunia. Kami lalu mempelajari segala tentang tangan. Budi Warno, Kim Sungil, Wang Weissen",
    publishedDate: "2025-06-19",
    license: "CC Attribution",
    tags: ["medical", "anatomy"],
    images: ["/image1.jpg", "/image2.jpg", "/image3.jpg"],
    relatedModels: [],
    modelUrl: "/models/model1.stl",
    previewImage: "/image1.jpg",
  },
  {
    id: "model-2",
    title: "Brain Model",
    author: "Dr. Lee",
    username: "@drlee",
    downloads: 98,
    likes: 70,
    imageUrl: "/image2.jpg",
    category: "3D Models",
    shares: 100,
    description: "Placeholder description for Brain Model.",
    publishedDate: "2025-06-19",
    license: "CC Attribution",
    tags: ["medical", "brain"],
    images: ["/image2.jpg"],
    relatedModels: [],
    modelUrl: "/models/model1.stl",
    previewImage: "/image2.jpg",
  }
  // Add more models as needed, following the same structure
];

const createProductDetail = (model: any) => ({
  ...model
});

export default function Home() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { isLoggedIn } = useSelector((state: RootState) => state.auth)
  const { 
    recentModels, 
    popularModels, 
    otherModels, 
    loading, 
    isSearching,
    searchLoading 
  } = useSelector((state: RootState) => state.models)

  React.useEffect(() => {
    // Only load home data if not searching
    if (!isSearching) {
      loadModelsData()
    }
  }, [dispatch, isSearching])

  const loadModelsData = async () => {
    dispatch(setLoading(true))
    
    try {
      // Simulate API loading delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Use manual model data for all sections
      dispatch(setRecentModels(manualModels))
      dispatch(setPopularModels(manualModels))
      dispatch(setOtherModels(manualModels))
    } catch (error) {
      console.error('Failed to load models:', error)
    } finally {
      dispatch(setLoading(false))
    }
  }

  const handleModelClick = (model: any) => {
    const productDetail = createProductDetail(model)
    
    // Set current model in Redux state for the product page
    dispatch(setCurrentModel(productDetail))
    
    // Navigate to product page
    router.push(`/product?id=${model.id}`)
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className='mt-[92px] space-y-12 mb-[64px]'>
        {isSearching ? (
          // Search Results View
          searchLoading ? (
            <ModelGridSkeleton title="Search Results" count={8} />
          ) : (
            <SearchModelGrid onModelClick={handleModelClick} />
          )
        ) : (
          // Normal Home View
          loading ? (
            <>
              <ModelGridSkeleton title="Recently Add" count={8} />
              <ModelGridSkeleton title="Popular" count={8} />
              <ModelGridSkeleton title="Other Models" count={8} />
            </>
          ) : (
            <>
              <ModelGrid 
                title="Recently Add" 
                models={recentModels} 
                onModelClick={handleModelClick}
              />
              <ModelGrid 
                title="Popular" 
                models={popularModels} 
                onModelClick={handleModelClick}
              />
              <InfiniteModelGrid 
                title="Other Models" 
                onModelClick={handleModelClick}
              />
            </>
          )
        )}
      </main>

      <Footer />
    </div>
  );
}
