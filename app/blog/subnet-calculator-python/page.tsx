import { Metadata } from "next"
import { BlogPostLayout } from "@/components/blog/blog-post-layout"

export const metadata: Metadata = {
  title: "Building a Subnet Calculator CLI Tool in Python | Mahmoud Taha",
  description: "Step-by-step tutorial on creating a command-line subnet calculator using Python's ipaddress module. Perfect for network engineers.",
}

const relatedPosts = [
  {
    title: "Understanding OSPF: A Complete Guide for CCNA Students",
    href: "/blog/understanding-ospf",
    category: "Networking",
  },
  {
    title: "Network Automation with Python: Building a Cisco Device Scanner",
    href: "/blog/network-automation-python",
    category: "Automation",
  },
  {
    title: "Securing Your Network: ACL Best Practices",
    href: "/blog/acl-best-practices",
    category: "Security",
  },
]

export default function SubnetCalculatorBlogPost() {
  return (
    <BlogPostLayout
      title="Building a Subnet Calculator CLI Tool in Python"
      category="Development"
      date="December 2025"
      readTime="8 min read"
      tags={["Python", "Subnetting", "CLI"]}
      relatedPosts={relatedPosts}
    >
      <p>
        Subnetting is a fundamental skill for network engineers, but doing calculations manually can be tedious and error-prone. In this tutorial, we&apos;ll build a powerful command-line subnet calculator in Python that can help you quickly calculate network information, split subnets, and export results to CSV.
      </p>

      <h2>IP Addressing and CIDR Basics</h2>

      <p>
        Before diving into the code, let&apos;s review some essential concepts:
      </p>

      <h3>IPv4 Addressing</h3>

      <p>
        An IPv4 address consists of 32 bits, typically represented as four octets in dotted-decimal notation (e.g., 192.168.1.100). Each octet ranges from 0 to 255.
      </p>

      <h3>CIDR Notation</h3>

      <p>
        Classless Inter-Domain Routing (CIDR) notation combines an IP address with a prefix length that indicates the number of network bits. For example:
      </p>

      <ul>
        <li><code>192.168.1.0/24</code> - 24 network bits, 8 host bits (256 addresses)</li>
        <li><code>10.0.0.0/8</code> - 8 network bits, 24 host bits (16,777,216 addresses)</li>
        <li><code>172.16.0.0/12</code> - 12 network bits, 20 host bits (1,048,576 addresses)</li>
      </ul>

      <h3>Key Terms</h3>

      <table>
        <thead>
          <tr>
            <th>Term</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Network Address</td>
            <td>First address in a subnet (all host bits = 0)</td>
          </tr>
          <tr>
            <td>Broadcast Address</td>
            <td>Last address in a subnet (all host bits = 1)</td>
          </tr>
          <tr>
            <td>Usable Hosts</td>
            <td>Total addresses minus network and broadcast</td>
          </tr>
          <tr>
            <td>Subnet Mask</td>
            <td>32-bit mask indicating network vs host portions</td>
          </tr>
        </tbody>
      </table>

      <h2>Python ipaddress Module Overview</h2>

      <p>
        Python 3.3+ includes the <code>ipaddress</code> module, which provides powerful tools for working with IP addresses and networks. Let&apos;s explore its key features:
      </p>

      <pre><code>{`import ipaddress

# Create an IP address object
ip = ipaddress.ip_address('192.168.1.100')
print(f"IP: {ip}")
print(f"Version: IPv{ip.version}")
print(f"Is Private: {ip.is_private}")

# Create a network object
network = ipaddress.ip_network('192.168.1.0/24')
print(f"Network: {network}")
print(f"Netmask: {network.netmask}")
print(f"Broadcast: {network.broadcast_address}")
print(f"Num Addresses: {network.num_addresses}")
print(f"Usable Hosts: {network.num_addresses - 2}")

# Create an interface (IP with network context)
interface = ipaddress.ip_interface('192.168.1.100/24')
print(f"Network: {interface.network}")
print(f"IP: {interface.ip}")`}</code></pre>

      <h2>Building the CLI Step by Step</h2>

      <h3>Step 1: Project Structure</h3>

      <pre><code>{`subnet_calculator/
├── subnet_calc.py      # Main script
├── requirements.txt    # Dependencies (minimal for this project)
└── README.md           # Documentation`}</code></pre>

      <h3>Step 2: Basic Calculator Functions</h3>

      <pre><code>{`#!/usr/bin/env python3
"""
Subnet Calculator CLI Tool
A command-line tool for IP subnet calculations.
Author: Mahmoud Taha
"""

import ipaddress
import argparse
import sys


def calculate_subnet_info(ip_with_prefix):
    """
    Calculate detailed subnet information for a given CIDR notation.
    
    Args:
        ip_with_prefix: IP address with prefix (e.g., '192.168.1.0/24')
    
    Returns:
        Dictionary containing subnet details
    """
    try:
        # Handle both network and interface inputs
        if '/' not in ip_with_prefix:
            raise ValueError("Please provide CIDR notation (e.g., 192.168.1.0/24)")
        
        network = ipaddress.ip_network(ip_with_prefix, strict=False)
        
        info = {
            'input': ip_with_prefix,
            'network_address': str(network.network_address),
            'broadcast_address': str(network.broadcast_address),
            'netmask': str(network.netmask),
            'wildcard': str(network.hostmask),
            'prefix_length': network.prefixlen,
            'total_hosts': network.num_addresses,
            'usable_hosts': max(0, network.num_addresses - 2),
            'first_usable': str(network.network_address + 1) if network.num_addresses > 2 else 'N/A',
            'last_usable': str(network.broadcast_address - 1) if network.num_addresses > 2 else 'N/A',
            'ip_version': network.version,
            'is_private': network.is_private,
        }
        
        return info
    
    except ValueError as e:
        raise ValueError(f"Invalid input: {e}")


def print_subnet_info(info):
    """
    Display subnet information in a formatted table.
    """
    print("\\n" + "=" * 50)
    print("           SUBNET CALCULATION RESULTS")
    print("=" * 50)
    print(f"  Input:              {info['input']}")
    print("-" * 50)
    print(f"  Network Address:    {info['network_address']}")
    print(f"  Broadcast Address:  {info['broadcast_address']}")
    print(f"  Subnet Mask:        {info['netmask']}")
    print(f"  Wildcard Mask:      {info['wildcard']}")
    print(f"  Prefix Length:      /{info['prefix_length']}")
    print("-" * 50)
    print(f"  Total Addresses:    {info['total_hosts']:,}")
    print(f"  Usable Hosts:       {info['usable_hosts']:,}")
    print(f"  First Usable IP:    {info['first_usable']}")
    print(f"  Last Usable IP:     {info['last_usable']}")
    print("-" * 50)
    print(f"  IP Version:         IPv{info['ip_version']}")
    print(f"  Private Address:    {'Yes' if info['is_private'] else 'No'}")
    print("=" * 50 + "\\n")`}</code></pre>

      <h2>Adding Subnet Splitting Functionality</h2>

      <pre><code>{`def split_subnet(network_cidr, new_prefix):
    """
    Split a network into smaller subnets.
    
    Args:
        network_cidr: Original network in CIDR notation
        new_prefix: New prefix length for smaller subnets
    
    Returns:
        List of subnet dictionaries
    """
    try:
        network = ipaddress.ip_network(network_cidr, strict=False)
        
        if new_prefix <= network.prefixlen:
            raise ValueError(
                f"New prefix (/{new_prefix}) must be larger than "
                f"original prefix (/{network.prefixlen})"
            )
        
        if new_prefix > 32:
            raise ValueError("Prefix cannot exceed 32 for IPv4")
        
        subnets = []
        for subnet in network.subnets(new_prefix=new_prefix):
            subnets.append({
                'network': str(subnet.network_address),
                'cidr': str(subnet),
                'broadcast': str(subnet.broadcast_address),
                'usable_hosts': max(0, subnet.num_addresses - 2),
                'first_usable': str(subnet.network_address + 1) if subnet.num_addresses > 2 else 'N/A',
                'last_usable': str(subnet.broadcast_address - 1) if subnet.num_addresses > 2 else 'N/A',
            })
        
        return subnets
    
    except ValueError as e:
        raise ValueError(f"Split error: {e}")


def print_subnets(subnets, original_network):
    """
    Display split subnets in a formatted table.
    """
    print(f"\\n{'=' * 70}")
    print(f"  Splitting {original_network} into {len(subnets)} subnets")
    print(f"{'=' * 70}")
    print(f"  {'#':<4} {'Network':<20} {'Broadcast':<16} {'Usable':<10} {'Range'}")
    print(f"{'-' * 70}")
    
    for i, subnet in enumerate(subnets, 1):
        range_str = f"{subnet['first_usable']} - {subnet['last_usable']}"
        print(f"  {i:<4} {subnet['cidr']:<20} {subnet['broadcast']:<16} {subnet['usable_hosts']:<10} {range_str}")
    
    print(f"{'=' * 70}\\n")`}</code></pre>

      <h2>CSV Export Feature</h2>

      <pre><code>{`import csv
from datetime import datetime


def export_to_csv(data, filename=None):
    """
    Export subnet data to CSV file.
    
    Args:
        data: List of dictionaries or single dictionary
        filename: Output filename (auto-generated if None)
    
    Returns:
        Path to created file
    """
    if filename is None:
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f'subnet_data_{timestamp}.csv'
    
    # Ensure data is a list
    if isinstance(data, dict):
        data = [data]
    
    if not data:
        raise ValueError("No data to export")
    
    # Write to CSV
    with open(filename, 'w', newline='') as csvfile:
        fieldnames = data[0].keys()
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(data)
    
    print(f"Data exported to: {filename}")
    return filename`}</code></pre>

      <h2>Full Working Code</h2>

      <p>
        Here&apos;s the complete subnet calculator with CLI argument parsing:
      </p>

      <pre><code>{`#!/usr/bin/env python3
"""
Subnet Calculator CLI Tool
A powerful command-line tool for IP subnet calculations.
Author: Mahmoud Taha
GitHub: https://github.com/mahmoud-taha-dev/Subnet_Calculator
"""

import ipaddress
import argparse
import csv
import sys
from datetime import datetime


def calculate_subnet_info(ip_with_prefix):
    """Calculate detailed subnet information."""
    try:
        if '/' not in ip_with_prefix:
            raise ValueError("Please provide CIDR notation (e.g., 192.168.1.0/24)")
        
        network = ipaddress.ip_network(ip_with_prefix, strict=False)
        
        return {
            'input': ip_with_prefix,
            'network_address': str(network.network_address),
            'broadcast_address': str(network.broadcast_address),
            'netmask': str(network.netmask),
            'wildcard': str(network.hostmask),
            'prefix_length': network.prefixlen,
            'total_hosts': network.num_addresses,
            'usable_hosts': max(0, network.num_addresses - 2),
            'first_usable': str(network.network_address + 1) if network.num_addresses > 2 else 'N/A',
            'last_usable': str(network.broadcast_address - 1) if network.num_addresses > 2 else 'N/A',
            'ip_version': network.version,
            'is_private': network.is_private,
        }
    except ValueError as e:
        raise ValueError(f"Invalid input: {e}")


def split_subnet(network_cidr, new_prefix):
    """Split a network into smaller subnets."""
    network = ipaddress.ip_network(network_cidr, strict=False)
    
    if new_prefix <= network.prefixlen:
        raise ValueError(f"New prefix must be larger than /{network.prefixlen}")
    
    subnets = []
    for subnet in network.subnets(new_prefix=new_prefix):
        subnets.append({
            'network': str(subnet.network_address),
            'cidr': str(subnet),
            'broadcast': str(subnet.broadcast_address),
            'usable_hosts': max(0, subnet.num_addresses - 2),
            'first_usable': str(subnet.network_address + 1),
            'last_usable': str(subnet.broadcast_address - 1),
        })
    return subnets


def export_to_csv(data, filename=None):
    """Export data to CSV file."""
    if filename is None:
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f'subnet_data_{timestamp}.csv'
    
    data_list = [data] if isinstance(data, dict) else data
    
    with open(filename, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=data_list[0].keys())
        writer.writeheader()
        writer.writerows(data_list)
    
    print(f"✓ Exported to: {filename}")
    return filename


def print_info(info):
    """Display subnet information."""
    print("\\n" + "=" * 50)
    print("        SUBNET CALCULATOR RESULTS")
    print("=" * 50)
    print(f"  Network:       {info['network_address']}/{info['prefix_length']}")
    print(f"  Netmask:       {info['netmask']}")
    print(f"  Wildcard:      {info['wildcard']}")
    print(f"  Broadcast:     {info['broadcast_address']}")
    print("-" * 50)
    print(f"  Total IPs:     {info['total_hosts']:,}")
    print(f"  Usable Hosts:  {info['usable_hosts']:,}")
    print(f"  First Usable:  {info['first_usable']}")
    print(f"  Last Usable:   {info['last_usable']}")
    print("=" * 50 + "\\n")


def print_subnets(subnets):
    """Display split subnets."""
    print(f"\\n{'=' * 75}")
    print(f"  Generated {len(subnets)} subnets")
    print(f"{'=' * 75}")
    print(f"  {'#':<4} {'Subnet':<20} {'Broadcast':<16} {'Hosts':<8} {'Range'}")
    print("-" * 75)
    
    for i, s in enumerate(subnets, 1):
        print(f"  {i:<4} {s['cidr']:<20} {s['broadcast']:<16} "
              f"{s['usable_hosts']:<8} {s['first_usable']} - {s['last_usable']}")
    
    print("=" * 75 + "\\n")


def main():
    parser = argparse.ArgumentParser(
        description='Subnet Calculator CLI Tool',
        epilog='Example: python subnet_calc.py 192.168.1.0/24 --split 26'
    )
    
    parser.add_argument(
        'network',
        help='Network in CIDR notation (e.g., 192.168.1.0/24)'
    )
    parser.add_argument(
        '-s', '--split',
        type=int,
        metavar='PREFIX',
        help='Split network into subnets with this prefix'
    )
    parser.add_argument(
        '-e', '--export',
        metavar='FILE',
        nargs='?',
        const='auto',
        help='Export results to CSV (auto-generates filename if not specified)'
    )
    
    args = parser.parse_args()
    
    try:
        if args.split:
            # Split mode
            subnets = split_subnet(args.network, args.split)
            print_subnets(subnets)
            
            if args.export:
                filename = None if args.export == 'auto' else args.export
                export_to_csv(subnets, filename)
        else:
            # Info mode
            info = calculate_subnet_info(args.network)
            print_info(info)
            
            if args.export:
                filename = None if args.export == 'auto' else args.export
                export_to_csv(info, filename)
    
    except ValueError as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()`}</code></pre>

      <h2>Using the Calculator</h2>

      <pre><code>{`# Basic subnet info
$ python subnet_calc.py 192.168.1.0/24

==================================================
        SUBNET CALCULATOR RESULTS
==================================================
  Network:       192.168.1.0/24
  Netmask:       255.255.255.0
  Wildcard:      0.0.0.255
  Broadcast:     192.168.1.255
--------------------------------------------------
  Total IPs:     256
  Usable Hosts:  254
  First Usable:  192.168.1.1
  Last Usable:   192.168.1.254
==================================================

# Split into /26 subnets
$ python subnet_calc.py 192.168.1.0/24 --split 26

===========================================================================
  Generated 4 subnets
===========================================================================
  #    Subnet               Broadcast        Hosts    Range
---------------------------------------------------------------------------
  1    192.168.1.0/26       192.168.1.63     62       192.168.1.1 - 192.168.1.62
  2    192.168.1.64/26      192.168.1.127    62       192.168.1.65 - 192.168.1.126
  3    192.168.1.128/26     192.168.1.191    62       192.168.1.129 - 192.168.1.190
  4    192.168.1.192/26     192.168.1.255    62       192.168.1.193 - 192.168.1.254
===========================================================================

# Export to CSV
$ python subnet_calc.py 10.0.0.0/8 --split 16 --export subnets.csv
✓ Exported to: subnets.csv`}</code></pre>

      <h2>Conclusion</h2>

      <p>
        This subnet calculator demonstrates how Python&apos;s built-in <code>ipaddress</code> module makes network calculations straightforward. The tool handles edge cases, provides clear output, and can export results for documentation or further processing.
      </p>

      <p>
        Feel free to extend this tool with additional features like:
      </p>

      <ul>
        <li>IPv6 support (the ipaddress module already supports it)</li>
        <li>VLSM calculations for multiple subnets with different sizes</li>
        <li>Interactive mode for continuous calculations</li>
        <li>IP address validation and checking if an IP belongs to a subnet</li>
      </ul>

      <p>
        Check out the full project on my <a href="https://github.com/mahmoud-taha-dev/Subnet_Calculator" target="_blank" rel="noopener noreferrer">GitHub repository</a>.
      </p>
    </BlogPostLayout>
  )
}
