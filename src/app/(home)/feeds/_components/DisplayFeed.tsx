'use client'
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteFeedFn, fetchFeedsFn, updateFeedFn } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Loader } from 'lucide-react';
interface Feed {
  id: string;
  title: string;
  description: string;
  image_urls: any;
  video_url: string | null;
}


function FeedDisplay() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['feeds'],
    queryFn: fetchFeedsFn,
  });
  const [editModalOpen, setEditModalOpen] = useState(false);
const [editingFeed, setEditingFeed] = useState<Feed | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  
  const {mutate: deleteFeedMutation, isPending: isDeleting} = useMutation({
    mutationFn: deleteFeedFn,
    onSuccess: () => {
      // Invalidate and refetch the 'feeds' query after a successful deletion
      queryClient.invalidateQueries({ queryKey: ['feeds'] });
      toast({
        title: 'Success',
        description: 'Feed deleted successfully!',
      });
    },
    onError: (error) => {
      console.error('Error deleting feed:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete feed. Please try again.',
      });
    },
  });
  const { mutate: updateFeedMutation, isPending: isUpdating } = useMutation({
    mutationFn: (params: { id: string; data: any }) => updateFeedFn(params.id, params.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feeds'] });
      toast({ title: 'Success', description: 'Feed updated successfully!' });
      setEditModalOpen(false); // Close the modal
    },
    onError: (error) => {
      console.error('Error updating feed:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to update feed. Please try again.' });
    },
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const feedsPerPage = 3;

  if (isLoading) return <p>Loading...</p>;

  const feeds = data?.data?.feeds || [];
  const totalPages = Math.ceil(feeds.length / feedsPerPage);
  const paginatedFeeds = feeds.slice((currentPage - 1) * feedsPerPage, currentPage * feedsPerPage);
  const handleDeleteFeed = (feedId: string) => {
    deleteFeedMutation(feedId);
  };

  const handleEditFeed = (feed:{ id: string; title: string; description: string; image_urls: any; video_url: string | null }) => {
    setEditingFeed(feed);
    setEditedTitle(feed.title);
    setEditedDescription(feed.description);
    setEditModalOpen(true);
  };

    const handleSaveEdit = () => {
        if (editingFeed) {
        updateFeedMutation({
            id: editingFeed.id,
            data: {
            title: editedTitle,
            description: editedDescription,
            image_urls: editingFeed.image_urls,
            video_url: editingFeed.video_url,
            },
        });
        }
    };
  return (
    <div className="w-full max-w-2xl p-4">
      {paginatedFeeds.map((feed: { id: string; title: string; description: string; created_at: string | number | Date; image_urls: any[]; video_url: string | null }) => (
        <Card key={feed.id} className="mb-4 p-4 relative">
            {isDeleting && <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"><Loader size={32} className='animate-spin' /></div>}
        <div className='flex justify-between'>
            <h2 className="text-lg font-bold">{feed.title}</h2>
            <p className="text-xs text-gray-400">{new Date(feed.created_at).toLocaleString()}</p>
        </div>
          <p className="text-sm ">{feed.description}</p>
          
         <div className="mt-2">
            {feed.image_urls.length + (Array.isArray(feed.video_url) && feed.video_url.length > 0 ? 1 : 0) === 1 ? (
              // Single item, full width
              feed.image_urls.length > 0 ? (
                <img
                  src={feed.image_urls[0]}
                  alt="Feed"
                  className="w-full max-h-[250px] object-contain rounded-2xl cursor-pointer"
                  onClick={() => setSelectedMedia(feed.image_urls[0])}
                />
              ) : (
                Array.isArray(feed.video_url) && feed.video_url.length > 0 && feed.video_url[0] && typeof feed.video_url[0] === 'string' && (feed.video_url[0].startsWith('http://') || feed.video_url[0].startsWith('https://')) && (
                <video
                    controls
                    className="w-full max-h-[150px] object-contain rounded-lg cursor-pointer"
                    onClick={() => feed.video_url && setSelectedMedia(feed.video_url[0])}
                >
                    <source src={feed.video_url[0]} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                )
              )
            ) : (
              // Multiple items, grid layout
              <div className="grid grid-cols-2 gap-2">
                {feed.image_urls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt="Feed"
                    className="w-full h-32 object-cover rounded-lg cursor-pointer"
                    onClick={() => setSelectedMedia(url)}
                  />
                ))}
                {Array.isArray(feed.video_url) && feed.video_url.length > 0 && typeof feed.video_url[0] === 'string' && (feed.video_url[0].startsWith('http://') || feed.video_url[0].startsWith('https://')) && (
                  <video
                    controls
                    className="w-full h-32 object-cover rounded-lg cursor-pointer"
                    onClick={() => feed.video_url && setSelectedMedia(feed.video_url[0])}
                  >
                    <source src={feed.video_url[0]} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            )}
          </div>

          {/* Three-Dots Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger className="absolute top-2 right-2">⋮</DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleEditFeed(feed)}>Edit</DropdownMenuItem>
              <DropdownMenuItem className="text-red-500" onClick={() => handleDeleteFeed(feed.id)}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Card>
      ))}
       <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogTitle className='hidden'>Edit Feed</DialogTitle>
        <DialogContent>
          <h2 className="text-lg font-bold mb-4">Edit Feed</h2>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            placeholder="Title"
            className="w-full p-2 border rounded mb-2"
          />
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            placeholder="Description"
            className="w-full p-2 border rounded mb-4"
          />
          <div className="flex justify-end">
            <Button variant="secondary" onClick={() => setEditModalOpen(false)}>Cancel</Button>
            <Button className="ml-2" onClick={handleSaveEdit} disabled={isUpdating}>
              {isUpdating ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <Button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>Previous</Button>
        <span>Page {currentPage} of {totalPages}</span>
        <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>Next</Button>
      </div>

      {/* Modal for Viewing Media */}
      {selectedMedia && (
        <Dialog open={Boolean(selectedMedia)} onOpenChange={() => setSelectedMedia(null)}>
          <DialogContent>
            {selectedMedia.endsWith('.mp4') ? (
              <video controls className="w-full">
                <source src={selectedMedia} type="video/mp4" />
              </video>
            ) : (
              <img src={selectedMedia} alt="Full View" className="w-full" />
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default FeedDisplay;
