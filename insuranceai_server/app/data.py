POLICIES_DB = {
    "POL001": {
        "policy_id": "POL001",
        "provider": "ABC Health",
        "plan_type": "Family Health Insurance",
        "sum_insured": 300000,
        "premium": 12000,
        "coverage": ["Hospitalization", "Pre/Post Hospitalization", "Daycare procedures"],
        "exclusions": ["Maternity", "OPD", "Cosmetic Surgery"],
        "claim_process": {
            "steps": [
                "Notify insurer within 24 hours of hospitalization.",
                "Submit claim form along with hospital bills and discharge summary.",
                "Insurer processes claim within 15 working days.",
                "Receive reimbursement or cashless approval."
            ],
            "required_documents": [
                "Claim form",
                "Hospital bills",
                "Discharge summary",
                "Doctor’s prescription",
                "ID proof"
            ]
        }
    },
    "POL002": {
        "policy_id": "POL002",
        "provider": "SecureLife",
        "plan_type": "Term Life Insurance",
        "sum_insured": 2500000,
        "premium": 8500,
        "coverage": ["Death Benefit"],
        "exclusions": ["Suicide (1 year)", "War"],
        "claim_process": {
            "steps": [
                "Notify insurer immediately upon policyholder’s death.",
                "Submit claim form along with death certificate.",
                "Insurer verifies documents and processes claim within 30 days.",
                "Claim payout to nominee."
            ],
            "required_documents": [
                "Claim form",
                "Death certificate",
                "Policy document",
                "Nominee ID proof"
            ]
        }
    },
    "POL003": {
        "policy_id": "POL003",
        "provider": "HealthMax",
        "plan_type": "Individual Health Insurance",
        "sum_insured": 500000,
        "premium": 9000,
        "coverage": ["Hospitalization", "Maternity Benefits", "OPD"],
        "exclusions": ["Cosmetic Surgery"],
        "claim_process": {
            "steps": [
                "Inform insurer within 48 hours of hospitalization or maternity event.",
                "Fill claim form and attach relevant medical documents.",
                "Insurer reviews and settles claim in 20 working days.",
                "Receive payment via bank transfer."
            ],
            "required_documents": [
                "Claim form",
                "Medical bills",
                "Maternity records (if applicable)",
                "Doctor’s notes",
                "Policy copy"
            ]
        }
    },
    "POL004": {
        "policy_id": "POL004",
        "provider": "CarePlus",
        "plan_type": "Senior Citizen Health Insurance",
        "sum_insured": 200000,
        "premium": 14000,
        "coverage": ["Hospitalization", "Pre/Post Hospitalization"],
        "exclusions": ["Maternity", "Dental Care"],
        "claim_process": {
            "steps": [
                "Notify insurer as soon as hospitalization occurs.",
                "Submit claim form with hospital and diagnostic reports.",
                "Claim processed within 15 days for cashless or reimbursement.",
                "Follow up with insurer if delay occurs."
            ],
            "required_documents": [
                "Claim form",
                "Hospital bills",
                "Diagnostic reports",
                "Discharge summary",
                "ID proof"
            ]
        }
    }
}
