import { NextRequest, NextResponse } from 'next/server'

const templates: Record<string, (info: any) => string> = {
  privacy_policy: (info) => `Privacy Policy

Last updated: ${new Date().toLocaleDateString()}

1. Introduction
Welcome to ${info.business_name || 'Our Store'}. We respect your privacy and are committed to protecting your personal data.

2. Information We Collect
We collect information you provide directly such as your name, email address, and payment information when you make a purchase.

3. How We Use Your Information
We use your information to process orders, provide customer support, and send updates about your purchases.

4. Data Protection
We implement security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.

5. Third-Party Services
We may share your information with payment processors and delivery services necessary to fulfill your order.

6. Contact
For questions about this policy, contact us at ${info.email || 'support@example.com'}

7. Changes to This Policy
We may update this policy periodically. Continued use of our services constitutes acceptance of any changes.`,

  refund_policy: (info) => `Refund Policy

Last updated: ${new Date().toLocaleDateString()}

1. Digital Products
Due to the nature of digital products (${info.product_type || 'digital goods'}), all sales are final. We do not offer refunds or exchanges once the product has been delivered.

2. Defective or Incorrect Products
If you receive a defective or incorrect product, please contact us within 7 days at ${info.email || 'support@example.com'}. We will resolve the issue promptly.

3. Cancellation
Orders that have not yet been processed may be cancelled. Once the product has been delivered, cancellations are not possible.

4. Chargebacks
If you file a chargeback without contacting us first, we reserve the right to dispute it with evidence of product delivery.

5. Contact
For refund inquiries: ${info.email || 'support@example.com'}`,

  terms_of_service: (info) => `Terms of Service

Last updated: ${new Date().toLocaleDateString()}

1. Acceptance of Terms
By purchasing from ${info.business_name || 'Our Store'}, you agree to these terms.

2. Product Description
We strive to accurately describe our ${info.product_type || 'digital products'}. However, we do not warrant that descriptions are error-free.

3. Intellectual Property
All products are for personal use only. You may not resell, distribute, or share the purchased content without explicit permission.

4. User Responsibilities
You agree not to misuse our products or attempt to circumvent any security measures.

5. Limitation of Liability
We shall not be liable for any indirect, incidental, or consequential damages arising from your purchase or use of our products.

6. Governing Law
These terms shall be governed by applicable laws.

7. Contact
Questions: ${info.email || 'support@example.com'}`,

  shipping_policy: (info) => `Shipping Policy

Last updated: ${new Date().toLocaleDateString()}

1. Delivery Method
All ${info.product_type || 'digital products'} are delivered instantly via download link after purchase.

2. Access Period
You will have unlimited access to your purchased products.

3. Technical Issues
If you experience issues accessing your purchase, contact ${info.email || 'support@example.com'} for assistance.

4. Delivery Confirmation
A confirmation email with download instructions will be sent to your registered email address.`,
}

export async function POST(req: NextRequest) {
  const { type, business_name, email, product_type } = await req.json()
  const info = { business_name: business_name || 'My Store', email: email || 'support@example.com', product_type: product_type || 'digital product' }
  if (type === 'all') {
    const result: Record<string, string> = {}
    for (const [key, gen] of Object.entries(templates)) {
      result[key] = gen(info)
    }
    return NextResponse.json(result)
  }
  const generator = templates[type as string]
  if (!generator) return NextResponse.json({ error: 'Invalid policy type' }, { status: 400 })
  return NextResponse.json({ [type]: generator(info) })
}

export async function GET() {
  return NextResponse.json({
    types: Object.keys(templates),
    labels: {
      privacy_policy: 'Privacy Policy',
      refund_policy: 'Refund Policy',
      terms_of_service: 'Terms of Service',
      shipping_policy: 'Shipping Policy',
    },
  })
}
