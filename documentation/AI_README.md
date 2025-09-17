# AI Documentation

## AI Tools:
This project was developed with the support of the following AI tools:
### 1. ChatGPT - I used it for:
* Research health scores + risk categories
* Creating realistic health score calculation
* Generating sample data
* Database 
* REST API fine tuning
* Design UI components (Dashboard, Loading spinner, ErrorBox, CustomButton, ProgressBar)
* Debug React errors (e.g. invalid React children)
* Docker and deployment
* Documentation and README
* Testing - Unit + Integration
* Refactoring code sections
* Deploy process

### 2. Claude - I used it for:
* Update sample data generation for better data
* Research and updating health score calculation

### 3. Deep ai - I used it for:
* Generating more realistic sample data.
* Docker

### 4. Copilot - I used it for:
* Handling CORS error
  


## Evidence and Examples
### 1) Generating Realistic Sample Data
Initially, I started creating realistic sample data using **ChatGPT**, but the distribution was biased and not realistic enough. I then tried **Claude** to see if it could produce a better-distributed dataset, but the results were still unsatisfactory. Finally, I switched to **Deep AI**, which generated more natural distributed data. This iterative process demonstrates evaluating multiple AI tools and refining approaches until a reliable solution is found.

### 2) React UI Development
Here's a partial example of how I worked with ChatGPT to help build the dashboard and frontend parts (for clarity, I shortened and removed the code snippet parts of the answers):

**Prompt:** *create a dashboard code for the frontend* 

**ChatGPT answer:** Suggested a simple React dashboard for the SaaS project that fetches customer health data and displays it meaningfully. 

----

**Prompt:** *I want to write it in TypeScript*


**ChatGPT answer:** Converted the dashboard to TypeScript for type safety and robustness.

----

**Prompt:** *Now help me create the frontend—all the dashboard—in React + TypeScript + split it into the most generic components possible.*

**ChatGPT answer:** Designed a component-based structure that is clean, reusable, and extendable.

---
**Prompt:** *what code needs to be in Card.tsx?*

**ChatGPT answer:** Provided a generic Card component suitable for customer cards or any info card in the dashboard. 

---
**Prompt:** *I want the main page to show the top 5 at-risk customers with their scores in a progress bar, plus a pie chart showing the distribution of healthy, at-risk, and middle-tier customers. Then, clicking on a customer should show all their events.*

**ChatGPT answer:** Redesigned the dashboard workflow to implement this logic in React + TypeScript.

---
**Prompt:** *I want the pie chart to show percentages + a menu by the side explaining each percentage.*

**ChatGPT answer:** Suggested using Recharts with a legend and percentage labels, keeping the logic generic and reusable.

---
**Prompt:** *Property 'percentage' does not exist on type 'Props'.ts(2339)*

**ChatGPT answer:** Guided through redesigning the dashboard to resolve type issues while keeping components generic.


### 3) Research on Customer Health Score
Here's a partial example of how I worked with ChatGPT for the research (for clarity, I shortened parts of the answers):

**Prompt:** *Explain each health score factor:*
* *Login frequency*
* *Feature adoption rate*
* *Support ticket volume*
* *Invoice payment timeliness*
* *API usage trends*

**ChatGPT answer:** Broke down each factor with definitions, measurement methods, and its significance in overall customer health scoring.
 
---
**Prompt:** *when do I get those tickets?*

**ChatGPT answer:** Clarified timing and conditions under which support tickets are logged.

---
**Prompt:** *what events means?*

**ChatGPT answer:** Explained that events represent any customer interactions or activities in the product—essentially footprints showing engagement.

---
**Prompt:** *What are API usage trends?*

**ChatGPT answer:** Detailed how API usage metrics reflect customer engagement patterns.

---
**Prompt:** *what kind of weights method do you suggest?*

**ChatGPT answer:** Recommended strategies for assigning weights to different health score factors, providing a data-driven approach to scoring. 

