export interface User {
    id: string;
    email: string;
    name: string;
    phone_number: string;
    sessionToken?: string;
}

export interface AuthState {
    user: User | null;
    isOnboardingCompleted: boolean;
    isLoading: boolean;
    isFirstLaunch: boolean;
    profil: Profil | null;
}

export interface AppSettings {
    language: string;
    currency: string;
    theme: string;
}

export interface Profil {
    profile_picture: string | null;
    account_number: string;
    account_state: string;
    name: string;
    benacc: any;
}

// Textes multilingues
export interface Translations {
    welcome: {
        title: string;
        subtitle: string;
        getStarted: string;
        next: string;
        previous: string;
    };
    auth: {
        login: string;
        signup: string;
        email: string;
        password: string;
        name: string;
        confirmPassword: string;
        forgotPassword: string;
        noAccount: string;
        hasAccount: string;
        createAccount: string,
        Login: string,
        phoneNumber: string;
        errorCredentials: string;
        subtitle: string;
    };
    common: {
        loading: string;
        error: string;
        success: string;
        cancel: string;
        confirm: string;
        next: string;
        previous: string;
        continue: string;
        selectLanguage: string;
        quit: string,
        step: string,
        on: string,
        of: string;
        close: string;
        retry: string;
        home: string;
        copyright: string;
        confirmation: string;
        save: string;
        update: string;
        processing: string;
        apply: string;
        status: string;
    };
    home: {
        title: string;
        subtitle: string;
        logout: string;
        expirationDate: string;
        migrate: string;
        date: string;
    };
    signup: {
        headerTitle: string;
        headerDescription: string;
        phoneTitle: string;
        phoneDescription: string;
        personnalTitle: string;
        personnalDescription: string;
        firstname: string;
        gender: string;
        birthdate: string;
        yourname: string;
        yourfirstname: string;
        benaccTitle: string;
        benaccDescription: string;
        identityTitle: string;
        identityDescription: string;
        identityType: string;
        cni: string;
        idNumber: string;
        idplaceholder: string;
        idsideface: string;
        idsideback: string;
        idphotoadd: string;
        warningMsg: string;
        idPhotosTitle: string;
        takePhoto: string;
        fromGallery: string;
        securityQuestions: string;
        selectQuestion: string;
        answerPlaceholder: string;
        answer: string;
        question: string;
        step3Title: string;
        step3Description: string;
        profilePicture: string;
        ppNote: string;
        summary: {
            notSpecified: string,
            edit: string,
            title: string,
            description: string
        },
        documents: string,
        number: string,
        passport: string,
        profilepictureUpdated: string,
    };
    benacc: {
        benaccTitle: string;
        features: {
            solo: {
                feature1: string;
                feature2: string;
                feature3: string;
                feature4: string;
            },
            light: {
                feature1: string;
                feature2: string;
                feature3: string;
                feature4: string;
                feature5: string;
                feature6: string;
            },
            ivory: {
                feature1: string;
                feature2: string;
                feature3: string;
            },
            platinum: {
                feature1: string;
                feature2: string;
                feature3: string;
                feature4: string;
            }
        },
        day: string;
        month: string;
        year: string;
        about_text: string;
        see: string;
        about: string;
        loading_msg: string;
        expiration: string;
        subscription: string;
        expire_at: string;
        active: string;
        inactive: string;
    };
    chooseOption: string;
    language: {
        value: string;
        title: string;
        french: string;
        english: string;
        spanish: string;
        arabic: string;
    };
    alerts: {
        congrats: string;
        accountcreated: string;
        success: string;
        error: string;
        cancelOpertionQuestion: string;
        yes: string;
        no: string;
        createMyAccount: string;
        fillAllFields: string;
        invalidEmail: string;
        invalidAmount: string;
        passwordMismatch: string;
        weakPassword: string;
        invalidPhoneNumber: string;
        securityQuestionsIncomplete: string;
        invalidIDNumber: string;
        uploadIDPhotos: string;
        selectAccountType: string;
        errorOccurred: string;
        ok: string;
        invalidCommission: string;
        paymentError: string;
        cancelPayment: string;
        comError: string;
        successPayment: string;
        invalidPassword: string;
    },
    migrations: {
        update: string;
        migrate: string;
        offerVisa: string;
        maintenanceFees: string;
        myBenefits: string;
        minimumSubscription: string;
        subscription: string;
        subscriptionPas: string;
        selectCard: string;
        validity: string;
        benefitAccount: string;
    },
    homenavigator: {
        benaccs: string;
        paybenacc: string;
        tvpackages: string;
        tvorders: string;
        deposit: string;
        visadeposit: string;
        transactions: string;
        accountTransfer: string;
        noAccountTransfer: string;
        earnings: string;
        settings: string;
        assistance: string;
    },
    operations: {
        accountTransfer: string;
        noAccountTransfer: string;
        deposit: string;
        visaDeposit: string;
        myTransactions: string;
        myBalance: string;
        payCanalBill: string;
        balance: string;
        card: string;
        statistics: string;
        seeAll: string;
        recentTransactions: string;
        pay: string;
        transfer: string;
        topup: string;
        withdraw: string;
        mycards: string;
        addCard: string;
    },
    title: {
        fillAllfields: string;
        deposit: string;
        paymentMethod: string;
        deposit2: string;
        visaPayment: string;
        security: string;
        paymentConfirmation: string;
        transfertConfirm: string;
        securePayment: string;
        immediateConfirmation: string;
        transactionDetails: string;
        operations: string;
        services: string;
    },
    fields: {
        amountToTransfer: string;
        estimateCom: string;
        seeCommission: string;
        cfaAmount: string;
        enterAmount: string;
        proressingTraitment: string;
        valid: string;
        amount: string;
        enterPassword: string;
        sesampayxPassword: string;
        reference: string;
    },
    assistance: {
        howContactUs: string;
        call: string;
        sendMail: string;
        chat: string;
        unavailableService: string;
        title: string;
        subtitle: string;
        contactus: string;
        contactusSubtitle: string;
        whatsapp: string;
        menuTitle: string;
        emergencyTitle: string;
        emergencyText: string;
        menuItem1Title: string;
        menuItem2Title: string;
        menuItem3Title: string;
        menuItem4Title: string;
        menuItem1Text: string;
        menuItem2Text: string;
        menuItem3Text: string;
        menuItem4Text: string;
    },
    transfer: {
        lastname: string;
        firstname: string;
    },
    payment: {
        minMonth: string;
        periodError: string;
        timeout: string;
        unknownStatus: string;
        finalizeSubscription: string;
        security2: string;
        unitPrice: string;
        monthsNumber: string;
        totalToPay: string;
        confirmIdentity: string;
        tvSubscription: string;
        commission: string;
        total: string;
        operatorFees: string;
        paymentDetails: string;
        noFees: string;
        fees: string;
        paymentSummary: string;
        visaFees: string;
        visaWebProcessing: string;
        visaWebError: string;
        smsCode: string;
        codeLabel: string;
        confirmLabel: string;
        confirmTitle: string;
        transactionSecurityTitle: string;
        transactionSecuritySubtitle: string;
        succesOperation: string;
        receipt: string;
    },
    transactions: {
        balanceAvailable: string
        empty: string
        here: string;
        remake: string;
    },
    tvOrders: {
        makeAt: string
        tel: string;
        ordersLoad: string;
        emty: string;
        invalidSubscription: string;
        loadPackagesError: string;
        emptySubscriptionError: string;
        confirmDelete: string;
        newSubscription: string;
        orders: string;
        validSelection: string;
        mySubscriptions: string;
        noSubscription: string;
        title1: string;
        monthNumber: string;
        setSubscription: string;
        subscriptionNumber: string;
        package: string;
        selectPackage: string;
    },
    status: {
        canceled: string;
        pending: string;
        validated: string;
        unknow: string;
    },
    actions: {
        delete: string
    },
    visa: {
        identifiantError: string;
        idcard: string;
        chiffres: string;
    },
    balance: {
        view: string;
        intro: string;
        subtitle: string;
        title: string;
    },
    request: {
        error_400: string;
        error_401: string;
        error_403: string;
        error_404: string;
        error_500: string;
        unknow: string;
        details_401: string;
        details_500: string;
        error_network: string;
        error_network_details: string;
    },
    operation: {
        new: string;
        confirmation_email: string;
        successPayment: string;

    },
    gains: {
        loadData: string;
        empty: string;
        unavailable: string;
        dashboard: string;
        filter: string;
        weekPeriod: string;
        dailyProfit: string;
        allOperations: string;
        operations: string;
        thisWeek: string;
        totalProfit: string;
        profit: string;
        cumWeek: string;
        aveDaily: string;
        aveDailyOp: string;
        perDay: string;
        aveDailyProfit: string;
        periodSummary: string;
        totalTransactions: string;
        week: string;
        dailyProfits: string;
        startDate: string;
        endDate: string;
        filterbyDate: string;
        selectedPeriod: string;
    },
    announcement: {
        headerSubtitle: string;
        emptyTitle: string;
        emptyText: string;
        loading: string;
        published: string;
        by: string;
    },
    ticket: {
        none: string;
        loadTicketError: string;
        open: string;
        close: string;
        pending: string;
        high: string;
        medium: string;
        low: string;
        general: string;
        loading: string;
        loading_error: string;
        emptyTitle: string;
        emptyText: string;
        reload: string;
        opens: string;
        closes: string;
        invalidCategory: string;
        invalidFaq: string;
        invalidTitle: string;
        invalidDescription: string;
        minTitle: string;
        minDescription: string;
        create_success: string;
        success: string;
        create_error: string;
        choose_category: string;
        new: string;
        category_title: string;
        category_subtitle: string;
        select_category: string;
        subject: string;
        subject_subtitle: string;
        subject_placeholder: string;
        description: string;
        description_subtitle: string;
        description_placeholder: string;
        on1000caracters: string;
        on100caracters: string;
        create: string;
        create_with_faq: string;
        ticket_total: string;
        my_tickets: string;
    },
    message: {
        loading_error: string;
        sending_error: string;
        now: string;
        created_at: string;
        priority: string;
        loading: string;
    },
    faq: {
        loading_error: string;
        loading: string;
        header_title: string;
        empty_title: string;
        empty_text1: string;
        empty_text2: string;
    },
    setting: {
        signout: string;
        signout_confirm: string;
        my_account: string;
        person_title: string;
        security_title: string;
        lang_title: string;
        help_title: string;
        cu_title: string;
        poli_title: string;
        version_title: string;
        version: string;
        note_title: string;
        share_title: string;
        share_msg_title: string;
        share_msg1: string;
        share_msg2: string;
        share_msg3: string;
        share_msg4: string;
        share_msg5: string;
        share_msg6: string;
        share_msg7: string;
        dialog_title: string;
        share_error: string;
    },
    profil: {
        value: string;
        loading: string;
        loading_error: string;
        permission_title: string;
        permission_text: string;
        updatepp: string;
        pp_error: string;
        signout: string;
        deconnected: string;
        "active": string;
        inactive: string;
        current: string;
        since: string;
        account: string;
        device_title: string;
        account_number: string;
    },
    security: {
        value: string;
        online_payment: string;
        online_payment_description: string;
        invalidPassword: string;
        min_password: string;
        miss_match_password: string;
        old_not_new_password: string;
        set_password_success_msg: string;
        set_password_warning_msg: string;
        warning: string;
        set_password_error: string;
        title: string;
        description: string;
        password_description: string;
        password_info: string;
        set_password: string;
        current_password: string;
        current_placeholder: string;
        new_password: string;
        new_placeholder: string;
        password_hint: string;
        password_confirm: string;
        confirm_placeholder: string;
        password_strength: string;
        strong: string;
        weak: string;
        info: string;
    },
    expense: {
        title: string;
        subtitle: string;
        detail_of_expense: string;
        add_expense: string;
        recurring: string
        amount: string;
        wording: string;
        wording_placeholder: string;
        budget: string;
        select_budget: string;
        category: string;
        select_category: string;
        picture: string;
        picture_choose: string;
        add: string;
        date: string;
        start_date: string;
        end_date: string;
        expense_history: string;
        search_placeholder: string;
        delete: string;
        delete_confirmation: string;
        duplicate: string;
        duplicate_confirmation: string;
        stop_recurring: string;
        stop_recurring_confirmation: string;
        cycle: string;
        active: string;
        no_repetive_cycle: string;
        stop_terminate: string;
        no_expenses_save: string;
        no_expenses_found: string;
        loading_expenses: string;
    },
    category: {
        new_title: string;
        create: string;
        update: string;
        update_title: string
        delete: string;
        delete_confirmation: string;
        system: string;
        list: string;
        no_category_found: string;
        loading_category: string;
    },

    filter_expense: {
        title: string
        period: string;
        all1: string;
        all2: string;
        alert_filter: string;
        to: string;
        filtering: string;
        reset_filter: string;
    },

    operation_crud_and_other: {
        on: string;
        page: string;
        yes: string;
        concel: string;
        validation_error: string;
        error_loading: string;
        unable_to_load_data: string;
        retry: string;
        please_wait: string;
        error: string;
        delete: string;
        enter_name: string;
        confirm_delete: string;
        warning_text: string;
        deletion_in_progress: string;
        update_in_progress: string;
        incorrect_name: string;
    },

    information_of_graph: {
        repartition_by_category: string;
        evolution: string;

        expense_tracking: string;
        week: string;
        month: string;
        year: string;
        total_expense: string;
        no_data: string;

        vs_next_week: string;
        since: string;
        new_expense: string;
    },
    toast_expense_category: {
        expense_added: string;
        expense_added_with_overrun: string;
        expense_deleted: string;
        expense_cycle_stopped: string;
        expense_duplicate: string;

        category_added: string;
        category_deleted: string;
        category_updated: string;
    },
    toast_validation_messages: {
        invalid_amount: string;
        invalid_label: string;
        category_required: string;
        start_date_required: string;
        end_date_required: string;
        invalid_dates: string;
        same_dates: string;
        end_before_start: string;
    },
    toast_validation_category: {
        empty_name: string;
        min_length: string;
        invalid_chars: string;
        duplicate_name: string;
    },
    dashboard: {
        most_consumed_categories:string;
        today: string;
        this_week: string;
        this_month: string;
        this_year: string;
        
        today_total: string;
        week_total: string;
        month_total: string;
        year_total: string;
        
        you_have_spent: string;
        via: string;
        transactions: string;
        highest_expense: string;
        lowest_expense: string;
        expense: string;
        dayly_expenses:string;
        weekly_expenses: string;
        monthly_expenses: string;
        annual_expenses: string;
        record_day: string;
        economical_day: string;
        record_month: string;
        economical_month: string;
        days_remaining: string;
        days_in_week_from_today: string;
        days_remaining_in_month: string;
        days_in_month: string;
        
        vs_yesterday: string;
        vs_last_week: string;
        new_expenses: string;
        since: string;
        
        no_expenses_today: string;
        no_expenses_week: string;
        no_expenses_month: string;
        no_expenses_year: string;
        no_categorized_expenses: string;
        
        unknown_category: string;
        updated_now: string;
        real_time_data: string;

        week_of:string;
        at:string;
        empty:string;
    }

    budget: {
        budget_overview: string;
        monthly_budget: string;
        remaining_budget: string;
        budget_amount: string;
        over_budget: string;

        title_accordeon_add: string;
        title_accordeon_update: string;
        cyclical_budget: string;
        cyclical_budget_type: string;
        budget_label: string;
        total_budget: string;
        start_date: string;
        end_date: string;
        allocation_category: string;
        category: string;
        amount: string;
        input_budget: string;
        title_category: string;
        add_category: string;
        btn_add_budget: string;
        btn_update_budget: string;
        cyclical_type: string;
        cancel: string;
        monthly_type: string;
        annual_type: string;
        weekly_type: string;
        seach_cycle: string;
        msg_renew_budget: string;

        handleAdd: {
            title1: string;
            message1: string;
            title2: string;
            message2: string;
            title3: string;
            message3: string;
            title4: string;
            message4: string;
            error_msg: string;
            message5: string;
            success_msg: string;
        },

        duplicate_category: string;
        msg_duplicate_category: string;
        archived_category: string;
        msg_archived_category: string;
        hasUnsavedChanges: {
            title1: string;
            title2: string;
            message2?: string;
            text1: string;
            text2: string;
        },

        handleDatePress: {
            title1: string;
            message1: string;
            title2: string;
            message2: string;
            title3?: string;
            message3: string;
            title4: string;
            message4: string;
            title5?: string;
            message5: string;
            title6: string;
            message6: string;
            error_msg: string;
        },

        handleUpdate: {
            error_msg: string;
            success_msg: string;
            cancel_msg: string;
        },

        over_budgets: {
            title: string;
            message: string;
            title2: string;
            message2: string;
            total_budget: string;
            budget_spent: string;
            over_spending: string;
            category_title: string;
            amount_spent: string;
            expense: string;
            emptyTitle: string;
            emptyText: string;
        },
        detail_budget: {
            title_accordeons: string;
            in_Progress: string;
            completed: string;
            recurring: string;
            categories: string;
            remaining: string;
            cycle_status: string;
            next_cycle: string;
            used: string;
            empty_title: string;
            empty_text: string;
            total_budget: string;
            total_allocated: string;
            spent: string;
        },

        budget_management: {
            title_accordeons: string;
            item_per_page: string;
            page: string;
            title_budgets: string;
            title_pagination: string;
            separator: string;
            status: string;
            all_status: string;
            total: string;
            loading_budget: string;
            emptyTitle: string;
            emptyText: string;
        },
        handleEdit: {
            title1: string;
            message1: string;
        },
        handleDelete: {
            title1: string;
            message1: string;
            title2: string;
            text1: string;
            text2: string;
            error_msg: string;
            success_msg: string;
        },

        handleStopCycle: {
            title1: string;
            message1: string;
            title2: string;
            text1: string;
            text2: string;
            error_msg: string;
            success_msg: string;
        }
    },

    operation_depenses: {
        filter: string;
        title_accordeon: string;
        all_operations: string;
    },

    Transaction_categorization: {
        title_accordeons: string;
        title_transaction: string;
        loading_transaction: string;
        emptyTitle: string;
        emptyText: string;

        title_header: string;
        title_modal: string;
        operation: string;
        amount: string;
        date: string;
        type: string;
        choose_category: string;
        amount_categorize: string;
        btn_cancel: string;
        btn_categorize: string;
        loading_categorization: string;
        btn_categorize_loading: string;
        title: string;
        error_msg: string;
        success_msg: string;
        error_msg2: string;
        message2: string;
        message3: string;
    },
    header_navbar: {
        dashbord: string;
        text_dashbord: string;
        category: string;
        text_category: string;
        budget: string;
        text_budget: string;
    }


}
