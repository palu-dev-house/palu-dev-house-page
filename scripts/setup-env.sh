#!/bin/bash

# =============================================================================
# Palu Dev House - Environment Setup Script
# =============================================================================
# This script helps you set up your environment files for development and production
# =============================================================================

set -e

echo "🚀 Palu Dev House - Environment Setup"
echo "===================================="

# Function to copy template file
copy_template() {
    local template=$1
    local target=$2
    local description=$3
    
    if [ -f "$target" ]; then
        echo "⚠️  $target already exists. Skipping..."
    else
        cp "$template" "$target"
        echo "✅ Created $target from template"
        echo "📝 $description"
    fi
}

# Function to check if .env.local exists
check_env_local() {
    if [ ! -f ".env.local" ]; then
        echo ""
        echo "🔧 Setting up local development environment..."
        copy_template ".env.development.template" ".env.local" \
            "Please update the values in .env.local for your local development"
    else
        echo "✅ .env.local already exists"
    fi
}

# Function to setup production environment
setup_production() {
    echo ""
    echo "🏭 Setting up production environment..."
    copy_template ".env.production.template" ".env.production" \
        "IMPORTANT: Update ALL placeholder values before deployment!"
}

# Function to show next steps
show_next_steps() {
    echo ""
    echo "📋 Next Steps:"
    echo "============"
    echo ""
    echo "🔧 For Local Development:"
    echo "   1. Edit .env.local with your local settings"
    echo "   2. Update ADMIN_PASSWORD and REVALIDATE_SECRET"
    echo "   3. Run: npm run dev"
    echo ""
    echo "🏭 For Production Deployment:"
    echo "   1. Edit .env.production with production values"
    echo "   2. CHANGE ALL placeholder secrets and passwords"
    echo "   3. Configure third-party services (Discord, Google Analytics, etc.)"
    echo "   4. Test all integrations"
    echo "   5. Deploy to your hosting platform"
    echo ""
    echo "🔒 Security Reminders:"
    echo "   • Never commit .env.local or .env.production to git"
    echo "   • Use strong, unique secrets in production"
    echo "   • Rotate secrets regularly"
    echo "   • Monitor for unauthorized access"
    echo ""
    echo "📚 Documentation:"
    echo "   • See .env.example for all available variables"
    echo "   • See template files for detailed configuration options"
}

# Main execution
main() {
    echo "📁 Current directory: $(pwd)"
    echo ""
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ]; then
        echo "❌ Error: Please run this script from the project root directory"
        exit 1
    fi
    
    # Setup local development
    check_env_local
    
    # Ask about production setup
    echo ""
    read -p "🏭 Do you want to set up production environment files? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        setup_production
    fi
    
    # Show next steps
    show_next_steps
    
    echo ""
    echo "✅ Environment setup complete!"
    echo "🎉 Happy coding with Palu Dev House!"
}

# Run main function
main "$@"
