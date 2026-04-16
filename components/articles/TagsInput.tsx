'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Plus, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { slugify } from '@/lib/utils'
import type { Tag } from '@/types/database.types'

interface TagsInputProps {
  selectedTags: Tag[]
  onChange: (tags: Tag[]) => void
}

export default function TagsInput({ selectedTags, onChange }: TagsInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [availableTags, setAvailableTags] = useState<Tag[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // Fetch all available tags
  useEffect(() => {
    const fetchTags = async () => {
      const { data, error } = await (supabase
        .from('tags') as any)
        .select('*')
        .order('name', { ascending: true })

      if (!error && data) {
        setAvailableTags(data)
      }
    }

    fetchTags()
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filter tags based on input
  const filteredTags = availableTags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
      !selectedTags.some((t) => t.id === tag.id)
  )

  // Check if input matches exactly an existing tag name (case-insensitive)
  const exactMatch = availableTags.find(
    (tag) => tag.name.toLowerCase() === inputValue.toLowerCase()
  )

  // Check if we should show the "Create new tag" option
  const showCreateOption =
    inputValue.trim() !== '' &&
    !exactMatch &&
    !selectedTags.some(
      (t) => t.name.toLowerCase() === inputValue.toLowerCase()
    )

  const addTag = (tag: Tag) => {
    if (!selectedTags.some((t) => t.id === tag.id)) {
      onChange([...selectedTags, tag])
    }
    setInputValue('')
    setShowDropdown(false)
    inputRef.current?.focus()
  }

  const removeTag = (tagId: string) => {
    onChange(selectedTags.filter((t) => t.id !== tagId))
  }

  const createTag = async () => {
    if (!inputValue.trim() || isCreating) return

    setIsCreating(true)

    try {
      const { data, error } = await (supabase
        .from('tags') as any)
        .insert({
          name: inputValue.trim(),
          slug: slugify(inputValue.trim()),
        })
        .select()
        .single()

      if (error) throw error

      if (data) {
        setAvailableTags((prev) => [...prev, data])
        addTag(data)
      }
    } catch (error) {
      console.error('Error creating tag:', error)
      alert('Failed to create tag')
    } finally {
      setIsCreating(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (showCreateOption) {
        createTag()
      } else if (filteredTags.length > 0) {
        addTag(filteredTags[0])
      }
    } else if (e.key === 'Backspace' && inputValue === '' && selectedTags.length > 0) {
      removeTag(selectedTags[selectedTags.length - 1].id)
    }
  }

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2 p-2 border border-slate-200 rounded-lg bg-white min-h-[42px] focus-within:ring-2 focus-within:ring-slate-900 focus-within:border-transparent">
        {/* Selected tags */}
        {selectedTags.map((tag) => (
          <span
            key={tag.id}
            className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-700 text-sm rounded-md"
          >
            {tag.name}
            <button
              type="button"
              onClick={() => removeTag(tag.id)}
              className="p-0.5 hover:bg-slate-200 rounded"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={handleKeyDown}
          placeholder={selectedTags.length === 0 ? 'Add tags...' : ''}
          className="flex-1 min-w-[120px] px-1 py-1 text-sm outline-none"
        />
      </div>

      {/* Dropdown */}
      {showDropdown && (filteredTags.length > 0 || showCreateOption) && (
        <div
          ref={dropdownRef}
          className="absolute z-10 mt-1 w-full max-h-48 overflow-auto bg-white border border-slate-200 rounded-lg shadow-lg"
        >
          {/* Existing tags */}
          {filteredTags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => addTag(tag)}
              className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center justify-between"
            >
              <span>{tag.name}</span>
              {selectedTags.some((t) => t.id === tag.id) && (
                <Check className="h-4 w-4 text-green-600" />
              )}
            </button>
          ))}

          {/* Create new tag option */}
          {showCreateOption && (
            <button
              type="button"
              onClick={createTag}
              disabled={isCreating}
              className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2 text-sky-600 border-t border-slate-100"
            >
              <Plus className="h-4 w-4" />
              <span>
                Create &quot;{inputValue.trim()}&quot;
                {isCreating && '...'}
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
