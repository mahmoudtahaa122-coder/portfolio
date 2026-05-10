import { Metadata } from "next"
import { BlogPostPage } from "@/components/blog/blog-post-page"

export const metadata: Metadata = {
  title: "Network Automation with Python: Building a Cisco Device Scanner | Mahmoud Taha",
  description: "Learn how to automate network device management using Python and Netmiko. Includes code examples for SSH connections and data extraction.",
}

export default function NetworkAutomationBlogPost() {
  return (
    <BlogPostPage
      slug="network-automation-python"
      fallbackTitle="Network Automation with Python: Building a Cisco Device Scanner"
      fallbackCategory="Automation"
      fallbackDate="February 2026"
      fallbackReadTime="15 min read"
      fallbackTags={["Python", "Netmiko", "Automation"]}
    >
      <p>
        Network automation has become an essential skill for modern network engineers. Gone are the days of manually configuring hundreds of devices one by one. In this tutorial, we&apos;ll build a practical Cisco Device Info Scanner using Python and Netmiko that can automatically connect to multiple devices, retrieve information, and export it to CSV.
      </p>

      <h2>Why Network Automation Matters</h2>

      <p>
        As networks grow in complexity, manual configuration becomes increasingly error-prone and time-consuming. Network automation offers several compelling benefits:
      </p>

      <ul>
        <li><strong>Consistency:</strong> Automated scripts execute the same way every time, eliminating human error</li>
        <li><strong>Speed:</strong> Configure hundreds of devices in minutes instead of hours or days</li>
        <li><strong>Auditability:</strong> Every change is logged and can be version-controlled</li>
        <li><strong>Scalability:</strong> The same script that works on 10 devices works on 1,000</li>
        <li><strong>Documentation:</strong> Scripts serve as living documentation of your network configurations</li>
      </ul>

      <h2>Setting Up the Environment</h2>

      <h3>Prerequisites</h3>

      <p>Before we begin, ensure you have Python 3.8+ installed on your system. We&apos;ll be using the following libraries:</p>

      <pre><code>{`# Create a virtual environment (recommended)
python -m venv network-automation
source network-automation/bin/activate  # On Windows: network-automation\\Scripts\\activate

# Install required packages
pip install netmiko
pip install paramiko
pip install pandas  # For CSV export`}</code></pre>

      <h3>Understanding Netmiko</h3>

      <p>
        Netmiko is a multi-vendor library that simplifies SSH connections to network devices. It handles the complexities of different vendor prompts, command timing, and session management.
      </p>

      <pre><code>{`from netmiko import ConnectHandler

# Device dictionary structure
device = {
    'device_type': 'cisco_ios',
    'host': '192.168.1.1',
    'username': 'admin',
    'password': 'cisco123',
    'secret': 'enable123',  # Enable password
    'port': 22,
}`}</code></pre>

      <h2>SSH Connection to Cisco Devices</h2>

      <h3>Basic Connection</h3>

      <pre><code>{`from netmiko import ConnectHandler
from netmiko.exceptions import NetmikoAuthenticationException, NetmikoTimeoutException

def connect_to_device(device_info):
    """
    Establish SSH connection to a Cisco device.
    Returns connection object or None if connection fails.
    """
    try:
        connection = ConnectHandler(**device_info)
        connection.enable()  # Enter privileged exec mode
        print(f"Successfully connected to {device_info['host']}")
        return connection
    except NetmikoAuthenticationException:
        print(f"Authentication failed for {device_info['host']}")
        return None
    except NetmikoTimeoutException:
        print(f"Connection timed out for {device_info['host']}")
        return None
    except Exception as e:
        print(f"Error connecting to {device_info['host']}: {str(e)}")
        return None`}</code></pre>

      <h3>Executing Commands</h3>

      <pre><code>{`def execute_command(connection, command):
    """
    Execute a command on the connected device.
    Returns the command output as a string.
    """
    try:
        output = connection.send_command(command)
        return output
    except Exception as e:
        print(f"Error executing command: {str(e)}")
        return None`}</code></pre>

      <h2>Retrieving Interface Status and Device Info</h2>

      <p>
        Now let&apos;s create functions to retrieve useful information from our Cisco devices:
      </p>

      <pre><code>{`import re

def get_device_info(connection):
    """
    Retrieve basic device information.
    Returns a dictionary with hostname, model, IOS version, and serial.
    """
    # Get show version output
    version_output = connection.send_command("show version")
    
    # Parse the output
    info = {
        'hostname': connection.find_prompt().replace('#', '').replace('>', ''),
        'model': '',
        'ios_version': '',
        'serial': '',
        'uptime': ''
    }
    
    # Extract model
    model_match = re.search(r'[Cc]isco\\s+(\\S+)', version_output)
    if model_match:
        info['model'] = model_match.group(1)
    
    # Extract IOS version
    version_match = re.search(r'Version\\s+(\\S+)', version_output)
    if version_match:
        info['ios_version'] = version_match.group(1)
    
    # Extract serial number
    serial_match = re.search(r'[Pp]rocessor\\s+board\\s+ID\\s+(\\S+)', version_output)
    if serial_match:
        info['serial'] = serial_match.group(1)
    
    # Extract uptime
    uptime_match = re.search(r'uptime is\\s+(.+)', version_output)
    if uptime_match:
        info['uptime'] = uptime_match.group(1)
    
    return info


def get_interface_status(connection):
    """
    Retrieve interface status information.
    Returns a list of dictionaries with interface details.
    """
    # Use TextFSM template for parsing (Netmiko has built-in support)
    interfaces = connection.send_command(
        "show ip interface brief",
        use_textfsm=True
    )
    
    # If TextFSM parsing fails, return raw output
    if isinstance(interfaces, str):
        return parse_interface_manual(interfaces)
    
    return interfaces


def parse_interface_manual(output):
    """
    Manually parse 'show ip interface brief' output.
    """
    interfaces = []
    lines = output.strip().split('\\n')[1:]  # Skip header
    
    for line in lines:
        parts = line.split()
        if len(parts) >= 6:
            interfaces.append({
                'interface': parts[0],
                'ip_address': parts[1],
                'ok': parts[2],
                'method': parts[3],
                'status': parts[4],
                'protocol': parts[5]
            })
    
    return interfaces`}</code></pre>

      <h2>Exporting Data to CSV</h2>

      <pre><code>{`import csv
import pandas as pd
from datetime import datetime

def export_to_csv(data, filename=None):
    """
    Export device data to CSV file.
    """
    if filename is None:
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f'device_inventory_{timestamp}.csv'
    
    # Using pandas for easy CSV export
    df = pd.DataFrame(data)
    df.to_csv(filename, index=False)
    print(f"Data exported to {filename}")
    return filename


def export_interfaces_csv(device_ip, interfaces, filename=None):
    """
    Export interface data to CSV file.
    """
    if filename is None:
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f'interfaces_{device_ip}_{timestamp}.csv'
    
    with open(filename, 'w', newline='') as csvfile:
        if interfaces:
            fieldnames = interfaces[0].keys()
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(interfaces)
    
    print(f"Interface data exported to {filename}")
    return filename`}</code></pre>

      <h2>Full Working Code: Cisco Device Info Scanner</h2>

      <p>
        Here&apos;s the complete script that ties everything together:
      </p>

      <pre><code>{`#!/usr/bin/env python3
"""
Cisco Device Info Scanner
A network automation tool to collect device information from multiple Cisco devices.
Author: Mahmoud Taha
"""

from netmiko import ConnectHandler
from netmiko.exceptions import NetmikoAuthenticationException, NetmikoTimeoutException
import csv
import re
import pandas as pd
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor, as_completed
import getpass

# Device list - can be loaded from a file
DEVICES = [
    {
        'device_type': 'cisco_ios',
        'host': '192.168.1.1',
        'username': 'admin',
        'password': 'cisco123',
        'secret': 'enable123',
    },
    {
        'device_type': 'cisco_ios',
        'host': '192.168.1.2',
        'username': 'admin',
        'password': 'cisco123',
        'secret': 'enable123',
    },
]


def connect_and_collect(device):
    """
    Connect to a device and collect all information.
    """
    result = {
        'host': device['host'],
        'status': 'Failed',
        'hostname': '',
        'model': '',
        'ios_version': '',
        'serial': '',
        'uptime': '',
        'interface_count': 0
    }
    
    try:
        # Establish connection
        connection = ConnectHandler(**device)
        connection.enable()
        
        # Get device info
        version_output = connection.send_command("show version")
        
        result['hostname'] = connection.find_prompt().replace('#', '')
        result['status'] = 'Success'
        
        # Parse version output
        model_match = re.search(r'[Cc]isco\\s+(\\S+)', version_output)
        if model_match:
            result['model'] = model_match.group(1)
        
        version_match = re.search(r'Version\\s+(\\S+)', version_output)
        if version_match:
            result['ios_version'] = version_match.group(1)
        
        serial_match = re.search(r'[Pp]rocessor\\s+board\\s+ID\\s+(\\S+)', version_output)
        if serial_match:
            result['serial'] = serial_match.group(1)
        
        uptime_match = re.search(r'uptime is\\s+(.+)', version_output)
        if uptime_match:
            result['uptime'] = uptime_match.group(1).strip()
        
        # Get interface count
        intf_output = connection.send_command("show ip interface brief")
        result['interface_count'] = len(intf_output.strip().split('\\n')) - 1
        
        # Disconnect
        connection.disconnect()
        
    except NetmikoAuthenticationException:
        result['status'] = 'Auth Failed'
    except NetmikoTimeoutException:
        result['status'] = 'Timeout'
    except Exception as e:
        result['status'] = f'Error: {str(e)}'
    
    return result


def scan_devices(devices, max_threads=5):
    """
    Scan multiple devices in parallel.
    """
    results = []
    
    print(f"Starting scan of {len(devices)} devices...")
    print("-" * 60)
    
    with ThreadPoolExecutor(max_workers=max_threads) as executor:
        futures = {executor.submit(connect_and_collect, device): device for device in devices}
        
        for future in as_completed(futures):
            device = futures[future]
            try:
                result = future.result()
                results.append(result)
                status_icon = "✓" if result['status'] == 'Success' else "✗"
                print(f"{status_icon} {result['host']}: {result['status']}")
            except Exception as e:
                print(f"✗ {device['host']}: Exception - {str(e)}")
    
    return results


def main():
    """
    Main function to run the scanner.
    """
    print("=" * 60)
    print("       Cisco Device Info Scanner")
    print("=" * 60)
    
    # Run the scan
    results = scan_devices(DEVICES)
    
    # Export to CSV
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = f'device_inventory_{timestamp}.csv'
    
    df = pd.DataFrame(results)
    df.to_csv(filename, index=False)
    
    print("-" * 60)
    print(f"Scan complete! Results exported to: {filename}")
    print(f"Total devices: {len(results)}")
    print(f"Successful: {len([r for r in results if r['status'] == 'Success'])}")
    print(f"Failed: {len([r for r in results if r['status'] != 'Success'])}")


if __name__ == "__main__":
    main()`}</code></pre>

      <h2>Running the Scanner</h2>

      <pre><code>{`# Make the script executable
chmod +x cisco_scanner.py

# Run the scanner
python cisco_scanner.py

# Output:
# ============================================================
#        Cisco Device Info Scanner
# ============================================================
# Starting scan of 2 devices...
# ------------------------------------------------------------
# ✓ 192.168.1.1: Success
# ✓ 192.168.1.2: Success
# ------------------------------------------------------------
# Scan complete! Results exported to: device_inventory_20260215_143022.csv
# Total devices: 2
# Successful: 2
# Failed: 0`}</code></pre>

      <h2>Best Practices and Tips</h2>

      <ol>
        <li><strong>Use environment variables</strong> for credentials instead of hardcoding them</li>
        <li><strong>Implement logging</strong> for debugging and audit trails</li>
        <li><strong>Add timeout handling</strong> for unresponsive devices</li>
        <li><strong>Use threading</strong> for faster execution across many devices</li>
        <li><strong>Store device lists</strong> in external files (YAML or JSON) for easier maintenance</li>
      </ol>

      <blockquote>
        <p>
          Security Tip: Never commit credentials to version control. Use environment variables or a secrets manager like HashiCorp Vault.
        </p>
      </blockquote>

      <h2>Conclusion</h2>

      <p>
        Network automation with Python and Netmiko opens up a world of possibilities for network engineers. This Cisco Device Info Scanner is just the beginning - you can extend it to push configurations, backup running configs, or even implement compliance checking. The key is to start small, test thoroughly, and gradually expand your automation toolkit.
      </p>

      <p>
        Check out the full project on my <a href="https://github.com/mahmoud-taha-dev/Cisco_Device_info_scanner" target="_blank" rel="noopener noreferrer">GitHub repository</a> for additional features and updates.
      </p>
    </BlogPostPage>
  )
}
