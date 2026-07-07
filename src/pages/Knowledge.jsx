import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  Search,
  UploadCloud,
  FileText,
  Clock,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Bookmark,
  Share2,
  Trash2,
  Check,
  Send,
  HelpCircle,
  Database,
  ArrowRight,
  Shield,
  Percent,
  BookOpenCheck,
  HelpCircle as FaqIcon,
  Map,
  Eye
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { useApp } from '../context/AppContext';
import { useNotifications } from '../context/NotificationContext';

export const Knowledge = () => {
  const { currentTemplate } = useApp();
  const { addNotification } = useNotifications();

  // Local State
  const [activeCategory, setActiveCategory] = useState('SOPs');
  const [searchQuery, setSearchQuery] = useState('');
  const [semanticAnswer, setSemanticAnswer] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  
  // Notion AI Chat Assistant States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', text: 'Hi! I am your Notion AI operation assistant. Ask me anything grounded in our company knowledge base documents.' }
  ]);

  // Upload Simulation States
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [indexingStatus, setIndexingStatus] = useState(null);

  // Dynamic Categories definition depending on templates vocabulary
  const getCategories = () => {
    return [
      { id: 'SOPs', label: 'SOPs', desc: 'Standard Operating Procedures', icon: BookOpen },
      { id: 'Policies', label: 'Company Policies', desc: 'Schedules, refunds & compliance guidelines', icon: Shield },
      { id: 'Pricing', label: 'Pricing Rules', desc: 'Slab pricing lists and co-pay brackets', icon: Percent },
      { id: 'Training', label: 'Training Documents', desc: 'Technician boarding tutorials', icon: BookOpenCheck },
      { id: 'Warranty', label: 'Warranty Info', desc: 'Equipment materials guarantees', icon: Shield },
      { id: 'FAQs', label: 'FAQs', desc: 'Common inquiries templates', icon: FaqIcon },
      { id: 'Guides', label: 'Workflow Guides', desc: 'Stage routing operational instructions', icon: Map }
    ];
  };

  // Dynamic template articles database mapping
  const [articles, setArticles] = useState({
    acService: {
      SOPs: [
        { id: 'ac-1', title: 'HVAC Diagnostics Standard Procedure', views: 320, updated: '3 days ago', size: '2.4 MB' },
        { id: 'ac-2', title: 'Winter Outdoor Compressor Prep Guide', views: 180, updated: '1 week ago', size: '1.8 MB' }
      ],
      Policies: [
        { id: 'ac-3', title: 'Customer Refund Policy for Faulty Installs', views: 245, updated: '2 weeks ago', size: '920 KB' },
        { id: 'ac-4', title: 'Emergency SLA Overtime Compensation rules', views: 110, updated: '1 month ago', size: '1.2 MB' }
      ],
      Pricing: [
        { id: 'ac-5', title: 'Quarterly Coil Maintenance Price Matrix', views: 420, updated: 'Yesterday', size: '420 KB' }
      ],
      Training: [
        { id: 'ac-6', title: 'Dave Miller’s Advanced HVAC Air Balancing SOP', views: 520, updated: '2 days ago', size: '5.2 MB' }
      ],
      Warranty: [
        { id: 'ac-7', title: 'Compressor Core Replacement Guarantee Policy', views: 380, updated: '4 days ago', size: '1.1 MB' }
      ],
      FAQs: [
        { id: 'ac-8', title: 'Filter Cleanliness & Customer Questions Sheet', views: 215, updated: '3 weeks ago', size: '810 KB' }
      ],
      Guides: [
        { id: 'ac-9', title: 'Duct Cleaning Routing & Checklist Protocol', views: 190, updated: '2 weeks ago', size: '1.5 MB' }
      ]
    },
    pestControl: {
      SOPs: [
        { id: 'pc-1', title: 'Fumigation Chemical Safety Intake Flow', views: 180, updated: '2 days ago', size: '3.1 MB' },
        { id: 'pc-2', title: 'Eco-Friendly Rodent Containment Setup Guide', views: 95, updated: '1 week ago', size: '1.2 MB' }
      ],
      Policies: [
        { id: 'pc-3', title: 'Fumigation Re-treatment Guarantee Program', views: 280, updated: '3 days ago', size: '890 KB' }
      ],
      Pricing: [
        { id: 'pc-4', title: 'Standard Termite Spraying Price Chart', views: 190, updated: 'Last week', size: '610 KB' }
      ],
      Training: [
        { id: 'pc-5', title: 'Handling Specialized Chemical Spraying Boarding', views: 220, updated: '2 weeks ago', size: '4.2 MB' }
      ],
      Warranty: [
        { id: 'pc-6', title: '12-Month Structural Clearance Warranty Terms', views: 310, updated: '5 days ago', size: '1.4 MB' }
      ],
      FAQs: [
        { id: 'pc-7', title: 'FAQ: Safety Guidelines post Fumigation Operations', views: 410, updated: 'Yesterday', size: '540 KB' }
      ],
      Guides: [
        { id: 'pc-8', title: 'Termite Scanning Diagnostic Map Flow', views: 150, updated: '3 days ago', size: '2.1 MB' }
      ]
    },
    clinic: {
      SOPs: [
        { id: 'cl-1', title: 'Patient Triage Intake SOP guidelines', views: 480, updated: '1 day ago', size: '1.5 MB' },
        { id: 'cl-2', title: 'Sanitization & Infection Control Protocol', views: 610, updated: '3 days ago', size: '4.8 MB' }
      ],
      Policies: [
        { id: 'cl-3', title: 'Late Arrival Patient Rescheduling Policies', views: 320, updated: '5 days ago', size: '720 KB' }
      ],
      Pricing: [
        { id: 'cl-4', title: 'Co-pay Insurance Payer Deductibles Matrix', views: 890, updated: 'Yesterday', size: '1.1 MB' }
      ],
      Training: [
        { id: 'cl-5', title: 'Dental X-Ray Scanner Operation Training', views: 340, updated: '2 weeks ago', size: '8.4 MB' }
      ],
      Warranty: [
        { id: 'cl-6', title: 'Dental Crowns Replacement Warranty Policy', views: 280, updated: '1 week ago', size: '950 KB' }
      ],
      FAQs: [
        { id: 'cl-7', title: 'Patient FAQs: Root Canal pre-operative cares', views: 512, updated: '2 days ago', size: '410 KB' }
      ],
      Guides: [
        { id: 'cl-8', title: 'Referral Clinic Form Dispatch Guide', views: 195, updated: '1 month ago', size: '1.8 MB' }
      ]
    },
    salon: {
      SOPs: [
        { id: 'sa-1', title: 'Arrival Blowdry & Hair Wash Flow Standard', views: 290, updated: '2 days ago', size: '1.1 MB' },
        { id: 'sa-2', title: 'Color Bleaching Setup and Wash Protocol', views: 410, updated: 'Yesterday', size: '3.4 MB' }
      ],
      Policies: [
        { id: 'sa-3', title: 'Styling Session Cancellation Refund Policy', views: 520, updated: '4 days ago', size: '610 KB' }
      ],
      Pricing: [
        { id: 'sa-4', title: 'Balayage Hair Treatment Pricing List', views: 610, updated: 'Yesterday', size: '540 KB' }
      ],
      Training: [
        { id: 'sa-5', title: 'Nail Acrylic Sculpting Step-by-Step boarding', views: 180, updated: '3 weeks ago', size: '6.2 MB' }
      ],
      Warranty: [
        { id: 'sa-6', title: 'Hair Extension Quality Guarantee Contract', views: 195, updated: '1 week ago', size: '920 KB' }
      ],
      FAQs: [
        { id: 'sa-7', title: 'FAQ: Coloring maintenance schedules sheet', views: 340, updated: '3 days ago', size: '320 KB' }
      ],
      Guides: [
        { id: 'sa-8', title: 'Walk-in Client Queue Allocation Map', views: 110, updated: '2 weeks ago', size: '1.3 MB' }
      ]
    },
    carService: {
      SOPs: [
        { id: 'cs-1', title: 'OBD Diagnostics Connector Checklist SOP', views: 320, updated: '1 day ago', size: '2.5 MB' },
        { id: 'cs-2', title: 'Engine Oil Replacement safety guidelines', views: 280, updated: '4 days ago', size: '1.6 MB' }
      ],
      Policies: [
        { id: 'cs-3', title: 'Vehicle Pick-up Delay storage charges rule', views: 190, updated: 'Last week', size: '480 KB' }
      ],
      Pricing: [
        { id: 'cs-4', title: 'Synthetic Fluid & Part Replacement cost matrix', views: 410, updated: 'Yesterday', size: '890 KB' }
      ],
      Training: [
        { id: 'cs-5', title: 'Brake Rotor Lathe machine calibration rules', views: 230, updated: '2 weeks ago', size: '5.6 MB' }
      ],
      Warranty: [
        { id: 'cs-6', title: '30-Day Tune-up Repair Guarantee Contract', views: 450, updated: '3 days ago', size: '1.2 MB' }
      ],
      FAQs: [
        { id: 'cs-7', title: 'FAQ: Diagnostic Fee vs Service Waiver Rules', views: 380, updated: 'Yesterday', size: '620 KB' }
      ],
      Guides: [
        { id: 'cs-8', title: 'Bay Allocation scheduling standard guides', views: 150, updated: '2 weeks ago', size: '1.4 MB' }
      ]
    },
    applianceRepair: {
      SOPs: [
        { id: 'ar-1', title: 'Refrigerator Motor diagnostic checks flow', views: 240, updated: '3 days ago', size: '2.8 MB' },
        { id: 'ar-2', title: 'Dryer Heater element installation safety checklist', views: 195, updated: '1 week ago', size: '1.9 MB' }
      ],
      Policies: [
        { id: 'ar-3', title: 'Part Ordering Delay notification rules', views: 110, updated: '2 weeks ago', size: '580 KB' }
      ],
      Pricing: [
        { id: 'ar-4', title: 'Appliance Brands service diagnostic pricing list', views: 390, updated: 'Yesterday', size: '740 KB' }
      ],
      Training: [
        { id: 'ar-5', title: 'Oven Circuit Board troubleshooting basics', views: 320, updated: '2 weeks ago', size: '6.4 MB' }
      ],
      Warranty: [
        { id: 'ar-6', title: 'Replacement Parts Guarantee coverage policy', views: 280, updated: '4 days ago', size: '1.1 MB' }
      ],
      FAQs: [
        { id: 'ar-7', title: 'FAQ: Troubleshooting codes index for clients', views: 420, updated: '3 days ago', size: '490 KB' }
      ],
      Guides: [
        { id: 'ar-8', title: 'Repair specialist dispatch routing guide', views: 180, updated: 'Last month', size: '2.2 MB' }
      ]
    }
  });

  // Recent Uploads State
  const [recentUploads, setRecentUploads] = useState([
    { id: 'up-1', title: 'SLA Response Guarantee Chart.pdf', date: 'Today, 2:40 PM', category: 'Policies' },
    { id: 'up-2', title: 'Technician safety board instructions.docx', date: 'Yesterday, 10:15 AM', category: 'Training' }
  ]);

  // Semantic search dictionary matches to make simulated Notion AI Q&A look grounded and responsive
  const getSemanticAnswer = (query) => {
    const qLower = query.toLowerCase();
    const customer = currentTemplate.terminology.customer;
    const service = currentTemplate.terminology.service;

    if (qLower.includes('warranty') || qLower.includes('guarantee')) {
      if (currentTemplate.id === 'clinic') {
        return {
          answer: 'According to the Dental Crowns Policy [1], replacement material is 100% warranted for 5 years. Patient co-pays apply only if failure is due to patient neglect or failure to maintain wellness check appointments.',
          citations: ['Dental Crowns Replacement Warranty Policy.pdf']
        };
      } else if (currentTemplate.id === 'salon') {
        return {
          answer: 'Under the Hair Extension Quality Guarantee [1], fitting services are guaranteed for 14 days post-treatment. Free styling adjustments are booked under "Stylist Review Session" if shedding exceeds standard thresholds.',
          citations: ['Hair Extension Quality Guarantee Contract.pdf']
        };
      } else if (currentTemplate.id === 'carService') {
        return {
          answer: 'All repair work includes a 30-Day Tune-up Guarantee [1]. If dashboard OBD warnings reappear for the same code within 30 days, re-diagnostics are provided free of charge.',
          citations: ['30-Day Tune-up Repair Guarantee Contract.pdf']
        };
      } else {
        return {
          answer: `All equipment work carries a standard 1-year replacement warranty. Compressors and heating cores carry specialized guarantees [1]. Replacement requests are indexed automatically under the dispatch calendar.`,
          citations: ['Compressor Core Replacement Guarantee Policy.pdf']
        };
      }
    }

    if (qLower.includes('refund') || qLower.includes('cancellation') || qLower.includes('late')) {
      return {
        answer: `Our cancellation rule states that cancellations made less than 24 hours prior to the scheduled ${service.toLowerCase()} incurs a 50% diagnostic baseline fee. Rescheduling requests must be approved by the coordinator before the dispatcher departs.`,
        citations: ['Late Arrival Rescheduling Policies.docx']
      };
    }

    if (qLower.includes('pricing') || qLower.includes('cost') || qLower.includes('fee')) {
      return {
        answer: `Basic inspections carry a fixed flat rate starting at $85. Detailed diagnostics are charged at $120. Complex repairs are billed according to standard part sheets [1] synced with our Stripe gateway.`,
        citations: ['Standard Fluid & Part Replacement pricing.pdf']
      };
    }

    return {
      answer: `Found relevant guidelines in our company ${activeCategory} catalog. If a dispatch checklist is required, consult our Operations Director Alex Rivera or access standard onboarding documents.`,
      citations: [`${activeCategory} Guidelines Document`]
    };
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSemanticAnswer(null);

    // Simulate Notion AI semantic indexing latency
    setTimeout(() => {
      const match = getSemanticAnswer(searchQuery);
      setSemanticAnswer(match);
      setIsSearching(false);
    }, 1200);
  };

  // Mock File Drag/Upload handler
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      simulateUpload(files[0].name);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      simulateUpload(files[0].name);
    }
  };

  const simulateUpload = (filename) => {
    setUploadProgress(10);
    setIndexingStatus('Uploading file payload...');

    // Progress Interval Simulation
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 60 && prev < 90) {
          setIndexingStatus('Running Gemini AI vector semantic indexing...');
          return prev + 15;
        } else if (prev >= 90) {
          clearInterval(interval);
          finalizeUpload(filename);
          return 100;
        }
        return prev + 25;
      });
    }, 450);
  };

  const finalizeUpload = (filename) => {
    setTimeout(() => {
      // Append to local articles list category
      const targetCategory = activeCategory;
      const cleanName = filename.replace(/\.[^/.]+$/, "");
      const newDoc = {
        id: 'new-' + Date.now().toString(),
        title: cleanName.charAt(0).toUpperCase() + cleanName.slice(1) + ' guidelines',
        views: 12,
        updated: 'Just now',
        size: '1.2 MB'
      };

      setArticles(prev => {
        const currentData = prev[currentTemplate.id] || prev.acService;
        const currentCategoryDocs = currentData[targetCategory] || [];
        return {
          ...prev,
          [currentTemplate.id]: {
            ...currentData,
            [targetCategory]: [newDoc, ...currentCategoryDocs]
          }
        };
      });

      // Append to recent uploads
      setRecentUploads(prev => [
        { id: 'up-' + Date.now().toString(), title: filename, date: 'Today, Just Now', category: targetCategory },
        ...prev
      ]);

      setUploadProgress(null);
      setIndexingStatus(null);

      addNotification({
        title: 'Document Indexed',
        description: `"${filename}" automatically vector indexed in ${targetCategory} database.`,
        type: 'success',
        category: 'customer'
      });
    }, 400);
  };

  // AI Chat QA Handler
  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = { role: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    const currentInput = chatInput;
    setChatInput('');

    // Simulate Notion AI conversation answering
    setTimeout(() => {
      const match = getSemanticAnswer(currentInput);
      const assistantMessage = {
        role: 'assistant',
        text: match.answer,
        citations: match.citations
      };
      setChatMessages(prev => [...prev, assistantMessage]);
    }, 900);
  };

  const templateArticles = articles[currentTemplate.id] || articles.acService;
  const currentCategoryArticles = templateArticles[activeCategory] || [];
  const activeCategoryObj = getCategories().find(c => c.id === activeCategory);

  return (
    <div className="flex gap-6 relative min-h-[calc(100vh-6rem)]">
      {/* Central Knowledge Panel */}
      <div className="flex-1 space-y-6 max-w-5xl">
        <PageHeader
          title="AI Knowledge Hub"
          description={`Browse and search dynamic corporate procedures, pricing lists, and FAQs for your ${currentTemplate.name} operations.`}
          breadcrumbs={[
            { label: 'SolveX Flow', to: '/' },
            { label: 'Knowledge Base', active: true }
          ]}
        />

        {/* Notion AI Semantic Search Block */}
        <Card className="border border-violet-100 bg-gradient-to-br from-violet-50/20 to-indigo-50/10 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 h-44 w-44 bg-violet-200/20 rounded-full blur-2xl pointer-events-none" />
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-violet-850">
              <Sparkles className="h-5 w-5 text-violet-600 animate-pulse shrink-0" />
              <h3 className="text-sm font-bold tracking-tight uppercase">Ask Notion AI Copilot</h3>
            </div>
            
            <form onSubmit={handleSearchSubmit} className="flex gap-2 relative">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-violet-400" />
                <input
                  type="text"
                  placeholder="Ask a question (e.g. 'What is the compressor replacement warranty policy?')..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs font-normal pl-10 pr-4 py-3 bg-white border border-violet-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 shadow-2xs placeholder-violet-400/70"
                />
              </div>
              <Button type="submit" variant="primary" className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl py-3 border-transparent" disabled={isSearching}>
                {isSearching ? 'Thinking...' : 'Ask AI'}
              </Button>
            </form>

            {/* AI Result display */}
            {isSearching && (
              <div className="p-4 bg-white/70 border border-violet-50/50 rounded-xl flex items-center gap-3 text-xs text-gray-500 animate-pulse">
                <Sparkles className="h-4 w-4 text-violet-500 shrink-0 rotate-180" />
                <span>Searching local procedures database and synthesizing answer summaries...</span>
              </div>
            )}

            {semanticAnswer && (
              <div className="p-4 bg-white border border-violet-100/60 rounded-xl shadow-3xs space-y-2.5 animate-fadeIn">
                <div className="text-xs text-gray-700 font-medium leading-relaxed">
                  {semanticAnswer.answer}
                </div>
                {semanticAnswer.citations && (
                  <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-gray-50">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Sources cited:</span>
                    {semanticAnswer.citations.map((cite, cIdx) => (
                      <Badge key={cIdx} variant="purple" styleType="subtle" className="text-[9px] py-0.5 font-semibold">
                        <FileText className="h-2.5 w-2.5 mr-1" />
                        {cite}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabbed Catalog Section & File Dropzone */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
          {/* Categories Navigation column */}
          <div className="space-y-1.5 md:col-span-1 bg-white border border-gray-100/80 rounded-xl p-2 shadow-3xs">
            <span className="text-[9px] font-bold text-gray-400 px-3 uppercase tracking-wider block mb-2 mt-1">Knowledge Shelves</span>
            {getCategories().map(cat => {
              const CatIcon = cat.icon;
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full flex items-center justify-between gap-2.5 p-2 rounded-lg text-left text-xs transition-colors font-medium border border-transparent ${
                    isSelected ? 'bg-primary-50/60 text-primary-750 font-semibold' : 'text-gray-600 hover:bg-gray-50/50'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <CatIcon className={`h-4 w-4 shrink-0 ${isSelected ? 'text-primary-600' : 'text-gray-400'}`} />
                    <span className="truncate">{cat.label}</span>
                  </div>
                  <ChevronRight className="h-3 w-3 text-gray-300" />
                </button>
              );
            })}
          </div>

          {/* Documents lists & Dropzone column */}
          <div className="md:col-span-3 space-y-6">
            {/* Category Listing Card */}
            <Card>
              <CardHeader className="flex flex-row justify-between items-center">
                <div>
                  <CardTitle>{activeCategoryObj?.label}</CardTitle>
                  <CardDescription>{activeCategoryObj?.desc}</CardDescription>
                </div>
                <Badge variant="blue" styleType="subtle" className="font-semibold">
                  {currentCategoryArticles.length} Files
                </Badge>
              </CardHeader>
              <CardContent className="p-0 border-b border-gray-50">
                {currentCategoryArticles.length === 0 ? (
                  <div className="p-8 text-center text-xs text-gray-400">
                    No documents indexed under this shelf category yet.
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {currentCategoryArticles.map(art => (
                      <div key={art.id} className="p-4 flex items-center justify-between hover:bg-gray-50/30 transition-colors">
                        <div className="flex items-center gap-3 truncate">
                          <div className="p-2 bg-gray-50 text-gray-400 border border-gray-100 rounded-lg shrink-0">
                            <FileText className="h-4 w-4 text-gray-500" />
                          </div>
                          <div className="truncate">
                            <p className="text-xs font-semibold text-gray-800 truncate">{art.title}</p>
                            <p className="text-[10px] text-gray-450 mt-0.5">Updated {art.updated} • Size: {art.size}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-semibold text-gray-400 bg-gray-50 border border-gray-100/50 px-1.5 py-0.5 rounded flex items-center gap-1 shrink-0">
                            <Eye className="h-3 w-3" />
                            {art.views} views
                          </span>
                          <Button variant="ghost" size="sm" className="h-7 w-7 text-gray-400 hover:text-gray-600 rounded-lg" onClick={() => alert('Viewing document detail layout...')}>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notion style drag and drop file upload indexer */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-6 transition-all text-center flex flex-col items-center justify-center relative bg-white ${
                isDragging ? 'border-primary-500 bg-primary-50/20' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {uploadProgress !== null ? (
                <div className="w-full max-w-xs space-y-3 py-4">
                  <div className="flex justify-between items-center text-xs font-semibold text-primary-950">
                    <span className="flex items-center gap-1.5 animate-pulse text-primary-700">
                      <Sparkles className="h-3.5 w-3.5 text-primary-500 animate-spin" />
                      {indexingStatus}
                    </span>
                    <span className="tabular-nums">{uploadProgress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-600 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              ) : (
                <>
                  <UploadCloud className="h-8 w-8 text-gray-400 mb-2.5" />
                  <p className="text-xs font-semibold text-gray-700">Drag & Drop documents to automatically vector index</p>
                  <p className="text-[10px] text-gray-400 mt-1">Supports PDF, DOCX, and PNG up to 10MB</p>
                  <div className="mt-3 relative">
                    <input
                      type="file"
                      id="k-upload"
                      accept=".pdf,.docx,.png,.jpg,.jpeg"
                      onChange={handleFileSelect}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <Button variant="outline" size="sm" className="h-8 text-xs font-semibold border-gray-250 select-none">
                      Select local files
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Dashboard displays: Popular, Suggested, AI summaries */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Recent Uploads */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400 shrink-0" />
                <CardTitle className="text-xs font-bold text-gray-800 uppercase tracking-wider">Recent Uploads</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0 border-b border-gray-50/50">
              <div className="divide-y divide-gray-50">
                {recentUploads.map(up => (
                  <div key={up.id} className="p-3 text-xs flex justify-between items-center">
                    <div className="truncate">
                      <p className="font-semibold text-gray-800 truncate">{up.title}</p>
                      <p className="text-[9px] text-gray-400 mt-0.5">Uploaded {up.date}</p>
                    </div>
                    <Badge variant="neutral" styleType="subtle" className="text-[9px]">
                      {up.category}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Popular Documents */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-gray-400 shrink-0" />
                <CardTitle className="text-xs font-bold text-gray-800 uppercase tracking-wider">Popular Files</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0 border-b border-gray-50/50">
              <div className="divide-y divide-gray-50 text-xs">
                <div className="p-3 flex justify-between items-center">
                  <span className="font-semibold text-gray-700 truncate">Quarterly Maintenance Price Matrix.pdf</span>
                  <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded shrink-0">420 views</span>
                </div>
                <div className="p-3 flex justify-between items-center">
                  <span className="font-semibold text-gray-700 truncate">Customer Refund Policy.docx</span>
                  <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded shrink-0">245 views</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI generated summaries preview */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-violet-500 shrink-0 animate-spin" />
                <CardTitle className="text-xs font-bold text-violet-950 uppercase tracking-wider">AI Operations Insights</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 text-xs font-normal text-violet-900 bg-gradient-to-br from-violet-50/20 to-indigo-50/10 rounded-xl space-y-2 border border-violet-100/50">
              <p className="leading-relaxed">
                <b>Operations Summary:</b> Late arrival cancellation rules mandate scheduling checks within 24 hours. Material replacements are protected under standard warranty timelines.
              </p>
              <p className="text-[10px] text-violet-600/70 font-semibold italic">
                Summarized from 3 verified training manuals.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Notion-AI Chat Assistant Panel Drawer */}
      <div className={`fixed right-0 top-16 bottom-0 w-80 bg-white border-l border-gray-100 flex flex-col shadow-2xl transition-all duration-300 z-40 ${
        isChatOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Toggle Button for Side Assistant */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="absolute left-0 top-24 -translate-x-10 h-10 w-10 bg-violet-600 hover:bg-violet-700 text-white rounded-l-xl flex items-center justify-center shadow-lg border-r border-violet-500 select-none cursor-pointer"
          title="Notion AI Chat Assistant"
        >
          <Sparkles className="h-4 w-4" />
        </button>

        {/* Assistant Header */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/30 flex items-center gap-2 flex-shrink-0">
          <Sparkles className="h-4.5 w-4.5 text-violet-600 shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-gray-900 leading-none">Notion AI Assistant</h4>
            <p className="text-[9px] text-gray-400 mt-1 font-medium">Referencing company knowledge base</p>
          </div>
        </div>

        {/* Assistant Messages box */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {chatMessages.map((msg, mIdx) => (
            <div key={mIdx} className={`flex flex-col space-y-1.5 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`p-2.5 rounded-xl text-xs max-w-[85%] font-normal leading-relaxed ${
                msg.role === 'user' ? 'bg-violet-600 text-white' : 'bg-gray-50 border border-gray-100 text-gray-700'
              }`}>
                {msg.text}
              </div>
              {msg.citations && (
                <div className="flex items-center gap-1 flex-wrap px-1">
                  <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">Citations:</span>
                  {msg.citations.map((cite, cIdx) => (
                    <span key={cIdx} className="text-[8px] font-semibold text-violet-750 flex items-center bg-violet-50 border border-violet-100 px-1 py-0.5 rounded">
                      {cite}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Assistant Input bar */}
        <form onSubmit={handleChatSubmit} className="p-3 border-t border-gray-100 flex gap-1.5 flex-shrink-0 bg-white">
          <input
            type="text"
            placeholder="Ask AI assistant anything..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            className="flex-1 text-xs pl-3 pr-2 py-2 bg-gray-50/50 border border-gray-250 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:bg-white transition-all"
          />
          <button type="submit" className="p-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors shrink-0">
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Knowledge;
