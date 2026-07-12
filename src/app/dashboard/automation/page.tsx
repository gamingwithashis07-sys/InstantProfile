'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { GlassCard } from '@/components/ui/GlassCard'
import { NeuButton } from '@/components/ui/NeuButton'
import { NeuInput } from '@/components/ui/NeuInput'
import { NeuSelect } from '@/components/ui/NeuSelect'
import { useToast } from '@/components/ui/Toast'
import {
  MessageCircle, Mail, Radio, Reply, AtSign, ArrowLeft, Bot, Zap,
  Shield, Plus, Clock, MessageSquare, ToggleLeft
} from 'lucide-react'

const comingSoonTriggers = ['story_reply', 'story_mention']
const postLiveTriggers = ['comment', 'live_comment']

const triggers = [
  { value: 'comment', label: 'User Comments on your post or reel', icon: MessageCircle, desc: 'Send a message when someone comments on your post or reel' },
  { value: 'dm', label: 'User DMs to you', icon: Mail, desc: 'Auto-reply when someone sends you a direct message' },
  { value: 'live_comment', label: 'User Comments on your LIVE', icon: Radio, desc: 'Engage with viewers who comment during your live stream' },
  { value: 'story_reply', label: 'User replies to your stories', icon: Reply, desc: 'Respond when someone replies to your story', comingSoon: true },
  { value: 'story_mention', label: 'User mentions you in story', icon: AtSign, desc: 'Trigger when someone mentions you in their story', comingSoon: true },
]

interface ResponseItem {
  id: string
  message: string
  delay?: string
}

export default function AutomationPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [step, setStep] = useState<'select' | 'configure'>('select')
  const [selectedTrigger, setSelectedTrigger] = useState<any>(null)
  const [accounts, setAccounts] = useState<any[]>([])
  const [saving, setSaving] = useState(false)
  const [autos, setAutos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    ig_account_id: '', name: '', message_template: '', delay_minutes: '0',
  })
  const [botProtection, setBotProtection] = useState(false)
  const [openingEnabled, setOpeningEnabled] = useState(false)
  const [openingMessage, setOpeningMessage] = useState('')
  const [followUpEnabled, setFollowUpEnabled] = useState(false)
  const [followUpMessage, setFollowUpMessage] = useState('')
  const [followUpDelay, setFollowUpDelay] = useState('5')
  const [responses, setResponses] = useState<ResponseItem[]>([])

  const isPostLive = selectedTrigger && postLiveTriggers.includes(selectedTrigger.value)

  const fetchData = async () => {
    const [aRes, autoRes] = await Promise.all([
      fetch('/api/ig/connect').then(r => r.json()),
      fetch('/api/dm/campaigns').then(r => r.json()),
    ])
    setAccounts(aRes)
    setAutos(autoRes)
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const handleSelectTrigger = (trigger: any) => {
    if (trigger.comingSoon) return
    setSelectedTrigger(trigger)
    setForm(prev => ({ ...prev, name: `Auto: ${trigger.label}` }))
    setStep('configure')
  }

  const handleBack = () => {
    setStep('select')
    setSelectedTrigger(null)
  }

  const addResponse = () => {
    setResponses(prev => [...prev, { id: Date.now().toString(), message: '', delay: '0' }])
  }

  const removeResponse = (id: string) => {
    setResponses(prev => prev.filter(r => r.id !== id))
  }

  const updateResponse = (id: string, field: keyof ResponseItem, value: string) => {
    setResponses(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r))
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.ig_account_id || !form.message_template) {
      showToast('Please fill all required fields', 'error')
      return
    }
    setSaving(true)

    const settings = {
      bot_protection: botProtection,
      opening_message: openingEnabled ? { enabled: true, message: openingMessage } : { enabled: false },
      follow_up: followUpEnabled && isPostLive && openingEnabled
        ? { enabled: true, message: followUpMessage, delay_minutes: parseInt(followUpDelay) || 5 }
        : { enabled: false },
      responses: responses.filter(r => r.message.trim()),
    }

    const res = await fetch('/api/dm/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ig_account_id: Number(form.ig_account_id),
        name: form.name,
        message_template: form.message_template,
        trigger_type: selectedTrigger.value,
        delay_minutes: Number(form.delay_minutes),
        settings,
      }),
    })
    setSaving(false)
    if (res.ok) {
      showToast('Automation created!', 'success')
      setStep('select')
      setSelectedTrigger(null)
      setForm({ ig_account_id: '', name: '', message_template: '', delay_minutes: '0' })
      setBotProtection(false)
      setOpeningEnabled(false)
      setOpeningMessage('')
      setFollowUpEnabled(false)
      setFollowUpMessage('')
      setFollowUpDelay('5')
      setResponses([])
      fetchData()
    } else {
      showToast('Failed to create automation', 'error')
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Bot className="w-6 h-6 text-[#f4a261]" />
        <h2 className="text-2xl font-bold">Automation</h2>
      </div>

      {step === 'select' && (
        <>
          <div className="mb-2">
            <h3 className="text-lg font-semibold">Select a Trigger</h3>
            <p className="text-sm text-[#6b5a4c] dark:text-[#9c8a7a]">When to run automation</p>
          </div>

          <div className="grid gap-3 mb-8">
            {triggers.map((trigger, i) => {
              const Icon = trigger.icon
              const isUsed = autos.some((a: any) => a.trigger_type === trigger.value)
              return (
                <motion.div
                  key={trigger.value}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <button
                    type="button"
                    className="w-full text-left"
                    onClick={() => handleSelectTrigger(trigger)}
                    disabled={trigger.comingSoon}
                  >
                    <GlassCard className={`p-4 cursor-pointer transition-all duration-200 border-2 group
                      ${trigger.comingSoon
                        ? 'opacity-50 cursor-not-allowed border-gray-500/20'
                        : 'hover:scale-[1.01] hover:border-[#f4a261]/40 border-transparent'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-[#f4a261]/20 to-[#e07c3c]/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          <Icon className="w-6 h-6 text-[#f4a261]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-sm">{trigger.label}</p>
                            {isUsed && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">active</span>
                            )}
                            {trigger.comingSoon && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400">Coming Soon</span>
                            )}
                          </div>
                          <p className="text-xs text-[#6b5a4c] dark:text-[#9c8a7a] mt-0.5">{trigger.desc}</p>
                        </div>
                        <Zap className={`w-5 h-5 transition-colors ${trigger.comingSoon ? 'text-gray-500' : 'text-[#9c8a7a] group-hover:text-[#f4a261]'}`} />
                      </div>
                    </GlassCard>
                  </button>
                </motion.div>
              )
            })}
          </div>

          {autos.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#6b5a4c] dark:text-[#9c8a7a] mb-3">Active Automations</h3>
              <div className="grid gap-2">
                {autos.map((a: any, i: number) => (
                  <motion.div key={a.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                    <GlassCard className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                        <p className="text-sm font-medium truncate">{a.name}</p>
                      </div>
                      <span className="text-xs text-[#9c8a7a] shrink-0 ml-2">{a.trigger_type}</span>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <AnimatePresence>
        {step === 'configure' && selectedTrigger && (
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
          >
            <button onClick={handleBack} className="flex items-center gap-1 text-sm text-[#6b5a4c] dark:text-[#9c8a7a] hover:text-[#f4a261] mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to triggers
            </button>

            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[#f4a261]/20 to-[#e07c3c]/20 flex items-center justify-center">
                  <selectedTrigger.icon className="w-5 h-5 text-[#f4a261]" />
                </div>
                <div>
                  <h3 className="font-bold">{selectedTrigger.label}</h3>
                  <p className="text-xs text-[#6b5a4c] dark:text-[#9c8a7a]">{selectedTrigger.desc}</p>
                </div>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <NeuSelect
                  label="Instagram Account"
                  options={[
                    { value: '', label: 'Select account...' },
                    ...accounts.map(a => ({ value: String(a.id), label: `@${a.ig_username}` })),
                  ]}
                  value={form.ig_account_id}
                  onChange={e => setForm({ ...form, ig_account_id: e.target.value })}
                  required
                />
                <NeuInput
                  label="Automation Name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                />

                {/* Response Flow */}
                <div className="border border-white/10 rounded-[16px] p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#f4a261]" />
                    <span className="font-semibold text-sm">Response Flow</span>
                  </div>

                  {/* Safety - Max Bot Protection */}
                  <div className="flex items-center justify-between p-3 rounded-[12px] bg-white/5">
                    <div className="flex items-start gap-3">
                      <Shield className="w-4 h-4 text-[#f4a261] mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Safety</p>
                        <p className="text-[11px] text-[#6b5a4c] dark:text-[#9c8a7a]">Max Bot Protection</p>
                        <p className="text-[10px] text-[#6b5a4c] dark:text-[#9c8a7a] mt-0.5">
                          Randomizes approved DM variants to reduce repeated bot-like patterns.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBotProtection(!botProtection)}
                      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${botProtection ? 'bg-emerald-500' : 'bg-gray-500/40'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${botProtection ? 'left-[25px]' : 'left-1'}`} />
                    </button>
                  </div>

                  {/* Opening Message */}
                  <div className="flex items-center justify-between p-3 rounded-[12px] bg-white/5">
                    <div className="flex items-start gap-3">
                      <ToggleLeft className="w-4 h-4 text-[#f4a261] mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Opening Message</p>
                        <p className="text-[11px] text-[#6b5a4c] dark:text-[#9c8a7a]">
                          {openingEnabled ? 'On' : 'Off'}
                        </p>
                        <p className="text-[10px] text-[#6b5a4c] dark:text-[#9c8a7a]">
                          First DM before the response flow.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOpeningEnabled(!openingEnabled)}
                      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${openingEnabled ? 'bg-emerald-500' : 'bg-gray-500/40'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${openingEnabled ? 'left-[25px]' : 'left-1'}`} />
                    </button>
                  </div>

                  {openingEnabled && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="pl-2"
                    >
                      <textarea
                        value={openingMessage}
                        onChange={e => setOpeningMessage(e.target.value)}
                        placeholder="Hey {{username}}! Thanks for engaging with our content..."
                        className="w-full p-3 rounded-[14px] bg-[#ece7e1] dark:bg-[#2a2522] border-2 border-transparent focus:border-[#f4a261] outline-none text-sm min-h-[60px]"
                      />
                    </motion.div>
                  )}

                  {/* Response Message (main) */}
                  <div>
                    <label className="text-sm font-medium mb-1 block">Response Message</label>
                    <textarea
                      value={form.message_template}
                      onChange={e => setForm({ ...form, message_template: e.target.value })}
                      required
                      className="w-full p-3 rounded-[14px] bg-[#ece7e1] dark:bg-[#2a2522] border-2 border-transparent focus:border-[#f4a261] outline-none text-sm min-h-[80px]"
                      placeholder="Thanks for the {{trigger}}! Check out our latest post..."
                    />
                    <p className="text-xs text-[#9c8a7a] mt-1">Use {'{{username}}'} for the user&apos;s name</p>
                  </div>

                  {/* Add Response button */}
                  <button
                    type="button"
                    onClick={addResponse}
                    className="flex items-center gap-2 text-sm text-[#f4a261] hover:underline"
                  >
                    <Plus className="w-4 h-4" /> Add Response
                  </button>

                  {/* Additional Responses */}
                  {responses.map((r, idx) => (
                    <motion.div
                      key={r.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="pl-4 border-l-2 border-[#f4a261]/30 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-[#6b5a4c] dark:text-[#9c8a7a]">Response #{idx + 1}</span>
                        <button type="button" onClick={() => removeResponse(r.id)} className="text-[10px] text-red-400 hover:underline">Remove</button>
                      </div>
                      <textarea
                        value={r.message}
                        onChange={e => updateResponse(r.id, 'message', e.target.value)}
                        placeholder="Alternative reply variant..."
                        className="w-full p-2.5 rounded-[12px] bg-[#ece7e1] dark:bg-[#2a2522] border-2 border-transparent focus:border-[#f4a261] outline-none text-xs min-h-[50px]"
                      />
                    </motion.div>
                  ))}

                  {/* Follow-up Message */}
                  {isPostLive && openingEnabled && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="border-t border-white/10 pt-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-start gap-2">
                          <Clock className="w-4 h-4 text-[#f4a261] mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Follow-up Message</p>
                            <p className="text-[11px] text-[#6b5a4c] dark:text-[#9c8a7a]">
                              Send after automation completes
                            </p>
                            <p className="text-[10px] text-[#6b5a4c] dark:text-[#9c8a7a]">
                              Available only for Post/Live triggers with Opening Message enabled.
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFollowUpEnabled(!followUpEnabled)}
                          className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${followUpEnabled ? 'bg-emerald-500' : 'bg-gray-500/40'}`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${followUpEnabled ? 'left-[25px]' : 'left-1'}`} />
                        </button>
                      </div>

                      {followUpEnabled && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          className="space-y-3 pl-2"
                        >
                          <textarea
                            value={followUpMessage}
                            onChange={e => setFollowUpMessage(e.target.value)}
                            placeholder="Follow-up: Hope you enjoyed our content! Here's something extra..."
                            className="w-full p-3 rounded-[14px] bg-[#ece7e1] dark:bg-[#2a2522] border-2 border-transparent focus:border-[#f4a261] outline-none text-sm min-h-[60px]"
                          />
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-[#9c8a7a]">Delay:</span>
                            <select
                              value={followUpDelay}
                              onChange={e => setFollowUpDelay(e.target.value)}
                              className="px-3 py-1.5 rounded-[10px] bg-[#ece7e1] dark:bg-[#2a2522] border-2 border-transparent focus:border-[#f4a261] outline-none text-xs"
                            >
                              <option value="1">1 min</option>
                              <option value="5">5 min</option>
                              <option value="15">15 min</option>
                              <option value="30">30 min</option>
                              <option value="60">1 hr</option>
                              <option value="180">3 hr</option>
                              <option value="360">6 hr</option>
                              <option value="720">12 hr</option>
                              <option value="1410">23 hr 30 min</option>
                            </select>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {/* Show hint if conditions not met for follow-up */}
                  {isPostLive && !openingEnabled && (
                    <div className="text-[11px] text-[#6b5a4c] dark:text-[#9c8a7a] italic border-t border-white/10 pt-3">
                      Enable Opening Message above to unlock Follow-up Message (delay: 1 min to 23 hr 30 min)
                    </div>
                  )}
                </div>

                <NeuInput
                  label="Initial Delay (minutes)"
                  type="number"
                  value={form.delay_minutes}
                  onChange={e => setForm({ ...form, delay_minutes: e.target.value })}
                />

                <div className="flex gap-3 pt-2">
                  <NeuButton variant="ghost" type="button" onClick={handleBack} className="flex-1">Cancel</NeuButton>
                  <NeuButton variant="primary" type="submit" loading={saving} className="flex-1">
                    <Zap className="w-4 h-4" /> Save Changes
                  </NeuButton>
                </div>
              </form>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
